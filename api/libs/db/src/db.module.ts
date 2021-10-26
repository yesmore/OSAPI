import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose'

// RBAC权限模型
import { User } from './models/user.model';
import { Admin } from './models/admin.model';
import { Role } from './models/role.model';
import { Access } from './models/access.model'
import { Roleaccess } from "./models/roleaccess.model";

// 数据模型
import { Focus } from "./models/focus.model";
import { DataType } from "./models/data_type.model";
import { DataTypeAttribute } from "./models/data_type_attribute.model";
import { DataCate } from "./models/data_cate.model";
import { Data } from "./models/data.model";
import {DataAttr} from "@lib/db/models/data_attr.model";

const models = TypegooseModule.forFeature([
  User,
  Admin, Role, Access, Roleaccess,
  Focus, DataType, DataTypeAttribute,DataCate,Data, DataAttr
])

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://127.0.0.1/apiroom', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
    models
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
