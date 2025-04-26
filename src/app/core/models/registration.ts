
export interface UserForm {
  name :string,
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  image: File | null;
}


export interface UsersList {
  id:number,
  name :string,
  email: string;
  phone_number: string;
  image: File | null;
}


