import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { UsersList } from '../../core/models/registration';
import { AddUsersComponent } from '../add-users/add-users.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [AddUsersComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent  implements OnInit{

  userList :UsersList[] =[]
  selectedUserId: number | null = null;


  constructor (public userService: UserService, private toastr: ToastrService){}

  ngOnInit(): void {
    this.onLoadUserListData();

    this.userService.refreshNeeded$.subscribe(() => {
      this.onLoadUserListData();
    });
  }


  onLoadUserListData() {
    this.userService.getRegisteredUsers().subscribe({
      next : (response) => {
        this.userList = response
      },
      error :(err)=> {
        console.log(err)
      },
      complete: () => {
        console.log("Fetching Data ")
      },
    })

  }



  onDeleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message)
        this.userService.userListRefreshNeeded.next();
      },
      error: (error) => {
        console.error('Delete Error:', error);
        this.toastr.error(error)
      }
    });
  }

  onEditUser(user: any) {
    this.selectedUserId = user.id;

  }

  onRegisterClick() {
    this.selectedUserId = null;
    this.userService.resetForm();
  }
  onFormClosed() {
    this.selectedUserId = null;
  }

}
