/*
* 角色权限接口
* */
export interface AccessInterface {
  module_name?: String
  action_name?: String
  type?: Number
  url?: String
  module_id?: String
  sort? : Number
  description?: String
  _id?: String
  status?: Number
}
