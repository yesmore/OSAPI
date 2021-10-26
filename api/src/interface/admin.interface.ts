/*
* 角色权限接口
* */

export interface AdminInterface {
  username?: String
  password?: String
  mobile?: String
  email?: String
  role_id?: String
  is_super? : Number
  status?: Number
  _id?: String
}
