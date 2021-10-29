/*
* 暴露公共服务给所有模块使用
* */

import { Module } from '@nestjs/common';
import {DbModule} from "@lib/db";

// adminModule service - start
import { ToolsService } from '../../service/tools/tools.service';
import { AdminService } from '../../service/admin/admin.service';
import { RoleService } from '../../service/role/role.service';
import {AccessService } from '../../service/access/access.service'
import { RoleaccessService } from "../../service/roleaccess/roleaccess.service";
import { FocusService } from '../../service/focus/focus.service';

import { DataTypeService } from '../../service/data-type/data-type.service';
import { DataTypeAttributeService } from '../../service/data-type-attribute/data-type-attribute.service';
import { DataCateService } from '../../service/data-cate/data-cate.service';
import { DataService } from '../../service/data/data.service';
import { DataAttrService } from '../../service/data-attr/data-attr.service';
// adminModule service - end

@Module({
  imports: [DbModule],
  providers: [
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleaccessService,
    FocusService,
    DataTypeService,
    DataTypeAttributeService,
    DataCateService,
    DataService,
    DataAttrService,
  ],
  exports: [ // 暴露（中间件、模块使用）
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleaccessService,
    FocusService,
    DataTypeService,
    DataTypeAttributeService,
    DataCateService,
    DataService,
    DataAttrService,
  ]
})
export class PublicModule {}
