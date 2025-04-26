import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})


export class AddUsersComponent  implements OnChanges {
  
  registerForm!: FormGroup;
  @Input() editUserId: number | null = null;
  isEditMode: boolean = false;

  @Output() formClosed = new EventEmitter<void>();


 constructor(private fb: FormBuilder, private userService: UserService,private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      image: [null]
    }, { validators: this.passwordMatchValidator });

    this.userService.resetForm$.subscribe(() => {
      this.resetFormData();
    });
  }
  resetFormData() {
    this.registerForm.reset();
    this.addValidators();
    this.isEditMode = false;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editUserId'] && this.editUserId !== null) {
      this.loadUserData(this.editUserId);
    }
  }

  loadUserData(id: number) {

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.isEditMode = true;
        this.registerForm.patchValue({
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          password: user.password,
          confirmPassword: user.confirm_password,
          image: null
        });

        this.imageFile = null;


      // this.registerForm.get('password')?.clearValidators();
      // this.registerForm.get('confirmPassword')?.clearValidators();
      // this.registerForm.get('password')?.updateValueAndValidity();
      // this.registerForm.get('confirmPassword')?.updateValueAndValidity();


      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  imageFile: File | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({
        image: file
      });
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageFile = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


  addValidators() {
    this.registerForm.get('password')?.setValidators([Validators.required, Validators.minLength(3)]);
    this.registerForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.registerForm.get('password')?.updateValueAndValidity();
    this.registerForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }


    const formData = new FormData();
    formData.append('name', this.registerForm.get('name')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('phone_number', this.registerForm.get('phone_number')?.value);
    //formData.append('password', this.registerForm.get('password')?.value);
    //formData.append('confirm_password', this.registerForm.get('confirmPassword')?.value);


    if (this.registerForm.get('password')?.value) {
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('confirm_password', this.registerForm.get('confirmPassword')?.value);
    }

    if (this.registerForm.get('image')?.value) {
      formData.append('image', this.registerForm.get('image')?.value);
    }

    if (this.isEditMode && this.editUserId !== null) {
      this.userService.updateUser(this.editUserId, formData).subscribe({
        next: (response) => {

          this.toastr.success('User updated successfully!');
          this.registerForm.reset();
          this.userService.userListRefreshNeeded.next();
          this.isEditMode = false;
          this.resetFormAfterSubmit();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.toastr.error('Update error:', err);
        }
      });
    } else {

      this.userService.postUserRegisterData(formData).subscribe({
        next: (response) => {

          this.toastr.success('User registered successfully!');
          this.registerForm.reset();

        },
        error: (error) => {
          if (error.error && typeof error.error === 'object') {
            const firstKey = Object.keys(error.error)[0];
            const errorMessage = error.error[firstKey][0];

            this.toastr.error(errorMessage, 'Error');
          } else {
            this.toastr.error('Registration failed.', 'Error');
          }
        }
      });
    }
  }

  resetFormAfterSubmit() {
    this.registerForm.reset();
    this.addValidators();
    this.isEditMode = false;
    this.formClosed.emit();
  }

}
