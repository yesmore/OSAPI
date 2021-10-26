/*
* 角色权限接口
* */
import {Types} from "mongoose";

export interface DataTypeInterface {
  title?: String
  description?: String
  status?: Number
  _id?: String
  sort?: Number
}
