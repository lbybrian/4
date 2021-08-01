let origin = "http://localhost:8686"
// origin: origin,
const InterfaceConfig = {
  //假数据start
  getEventParam: {
    url: "/static/mock/eventParam.json",
    method: "get"
  },
  getEntitiLabel: {
    url: "/static/mock/entityLabel.json",
    method: "get",
  },
  getEventLabel: {
    url: "/static/mock/eventLabel.json",
    method: "get"
  },


  // ######  标注接口相关 start ######
  //文档列表，标注列表
  docList: {
    url: "/mark/docList",
    method: "post",
    bodyType: "application/json"
  },
  // 文档上传
  uploadAnalysis: {
    url: "/api/import/analysis",
    method: "post",
    bodyType: "application/json"
  },
  //获取文档详情
  postDocById: {
    url: "/mark/getDocById",
    method: "post",
    bodyType: "application/json"
  },
  //获取获取已标注的标签（swagger————查询标注结果接口）
  postMarklist: {
    url: "/mark/marklist",
    method: "post",
    bodyType: 'application/json'
  },
  //获取树结构哦
  getLabelZtree: {
    url: "/bqgl/tree",
    method: "get"
  },
  //获取树结构哦
  postDownload: {
    url: "/api/import/download",
    method: "post"
  },
  //获取标签颜色
  getLabelColor: {
    url: "/api/bqgl/getLabelColor",
    method: "post",
  },


  // ######  标注接口相关 end  ######
  // ######  整编接口相关 start  ######
  //获取词典
  queryDictData: {
    url: "/rest/v1/cm/dict",
    method: "get"
  },
  // 获取目录
  catalogData: {
    url: "/rest/v1/groupTree",
    method: "get"
  },
  // 素材列表
  queryMaterialTable: {
    url: "/rest/v1/index_sczb/sc_info/page/group",
    method: "post",
    bodyType: "application/json"
  },
  // 素材整编获取单条整编任务
  getzhengbianitemlist: {
    url: "/rest/v1/index_sczb/tscp_info",
    method: "get"
  },
  //获取摘要规则
  getAbstractRule: {
    url: "/rest/v1/zygz/list",
    method: "get"
  },
  // 模板列表
  mouldDataTable: {
    url: "/rest/v1/mbgl/page",
    method: "get"
  },
  //文档素材列表
  dxscList: {
    url: "/rest/v1/index_sczb/sc_info/page/cm/dxsc",
    method: "post",
    bodyType: "application/json"
  },
  //获取部门树形结构数据
  getDeptTree: {
    url: "/rest/v1/dept/deptTree",
    method: "get"
  },
  //获取角色列表
  getRolesList: {
    url: "/rest/v1/role/roles",
    method: "get"
  },
  //获取部门用户列表
  getDeptUsers: {
    url: "/rest/v1/user/users",
    method: "get"
  },
  // 任务详情
  reportAttribute: {
    url: "/rest/v1/sx/page",
    method: "get"
  },
  // ######  整编接口相关 end ######
  // ######  印证接口相关 start ######



  // ######  印证接口相关 end ######
  // ######  可视化接口相关 start ######



  // ######  可视化接口相关 end ######


  //原有接口
  getLabelZtree: {
    url: "/bqgl/tree",
    method: "get"
  },
  // getLogin: {
  //     url: "/user/login",
  //     method: "post"
  // },
  // loginOut: {
  //     url: "/api/user/loginOut",
  //     method: "post"
  // },
  addOrUpdateMark: {
    url: "/mark/addOrUpdate",
    method: "post"
  },
  adminAddOrUpdateMark: {
    url: "/mark/adminAddOrUpdate",
    method: "post"
  },
  getMarklist: {
    url: "/mark/marklist",
    method: "post"
  },
  addNode: {
    url: "/bqgl/add",
    method: "post"
  },
  editNode: {
    url: "/bqgl/editLabel",
    method: "post"
  },
  removeNode: {
    url: "/bqgl/delLabel",
    method: "post"
  },
  getUserInfo: {
    url: "/user/list",
    method: "post",
    bodyType: "application/json"
  },
  updateList: {
    url: "/user/update",
    method: "post"
  },
  addUserInfo: {
    url: "/user/add",
    method: "post"
  },
  removeUserList: {
    url: "/user/delete",
    method: "post"
  },
  cbjlDataTable: {
    url: "/rest/v1/index_sczb/tscp_info/page/cbjl",
    method: "get"
  },
  //繁体简体互转
  switchContent: {
    url: "/rest/v1/data/getTrToSimText",
    method: "post",
    bodyType: "application/json"
  },

  getDocById: {
    url: "/mark/getDocById",
    method: "post",
    bodyType: "application/json"
  },
  saveOrUpdate: {
    url: "/mark/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  saveOrUpdateRelation: {
    url: "/mark/saveOrUpdate/relation",
    method: "post",
    bodyType: "application/json"
  },
  markList: {
    url: "/mark/markList",
    method: "post",
    bodyType: "application/json"
  },
  markList: {
    url: "/mark/markList",
    method: "post",
    bodyType: "application/json"
  },
  labelOrRelationDel: {
    url: "/mark/delete",
    method: "delete",
    bodyType: "application/json"
  },
  relationSearch: {
    url: "/relation/tree",
    method: "get"
  },
  editLabelRelation: {
    url: "/relation/editLabelRelation",
    method: "post"
  },
  relationAdd: {
    url: "/relation/add",
    method: "post"
  },
  getDataByLabel: {
    url: "/bqgl/getDataByLabel",
    method: "post",
    bodyType: "application/json"
  },
  findDataById: {
    url: "/mark/getDataById",
    method: "post",
    bodyType: "application/json"
  },
  docTj: {
    url: "/mark/docTj",
    method: "post",
    bodyType: "application/json"
  },
  // 查看文档列表
  getDataByLabelAndText: {
    url: "/bqgl/getDataByLabelAndText",
    method: "post",
    bodyType: "application/json"
  },
  // 别名维护
  protectOrUpdate: {
    url: "/api/entityBm/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  entityBmdelete: {
    url: "/api/entityBm/delete",
    method: "delete"
  },
  //关系标签tree删除
  delLabelRelation: {
    url: "/api/relation/delLabelRelation",
    method: "post",
    bodyType: "application/json"
  },
  getDataRelationById: {
    url: "/mark/getDataRelationById",
    method: "post",
    bodyType: "application/json"
  },
  addEntitysaveOrUpdate: {
    url: "/api/entity/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  updateEntityByNameAndLabels: {
    url: "/api/entity/updateEntityByNameAndLabels",
    method: "post",
    bodyType: "application/json"
  },
  labelConfirm: {
    url: "/api/mark/confirm",
    method: "post",
    bodyType: "application/json"
  },
  getRelationByLabelAndLabels: {
    url: "/api/entity/getRelationByLabelAndLabels",
    method: "post",
    bodyType: "application/json"
  },
  delEntityByNameAndLabels: {
    url: "/api/entity/delEntityByNameAndLabels",
    method: "post",
    bodyType: "application/json"
  },
  menuList: {
    url: "/api/menu/list",
    method: "get"
  },
  menuAdd: {
    url: "/api/menu/add",
    method: "post"
  },
  menuDelete: {
    url: "/api/menu/delete",
    method: "post"
  },
  menuEdit: {
    url: "/api/menu/edit",
    method: "post"
  },
  roleList: {
    url: "/api/role/list",
    method: "get"
  },
  addRole: {
    url: "/api/role/add",
    method: "post"
  },
  editRole: {
    url: "/api/role/edit",
    method: "post"
  },
  deleteRole: {
    url: "/api/role/delete",
    method: "post"
  },
  grantMenuToRole: {
    url: "/api/role/grantMenuToRole",
    method: "post",
    bodyType: "application/json"
  },
  menuFindOne: {
    url: "/api/menu/findOne",
    method: "post"
  },
  uploadAnalysis: {
    url: "/api/import/analysis",
    method: "post",
    bodyType: "application/json"
  },
  getMenuListByRoleId: {
    url: "/api/role/getMenuListByRoleId",
    method: "get"
  },
  grantRoleToUser: {
    url: "/api/role/grantRoleToUser",
    method: "post",
    bodyType: "application/json"
  },
  deleteBatch: {
    url: "/api/user/deleteBatch",
    method: "post",
    bodyType: "application/json"
  },
  updatePwd: {
    url: "/api/user/updatePwd",
    method: "post"
  },
  filePath: {
    url: "/sczb-URL-prefix/cm/download"
  },
  getBisengDocData: {
    url: "/rest/v1/bs",
    method: "get"
  },
  ocrRequest: {
    url: "/sczb-URL-prefix/ocr/getTextByImage",
    method: "post",
    bodyType: "application/json"
  },
  bisengView: {
    url: "/sczb-URL-prefix/bs/view",
    method: "get"
  },
  fileCaptrue: {
    url: "/sczb-URL-prefix/cm/mbgl_info/read",
    method: "get"
  },
  extractItem: {
    url: "/sczb-URL-prefix/cm/entity_info/list",
    method: "post"
  },
  saveAsModule: {
    url: "/sczb-URL-prefix/mbgl/bwSaveToMb",
    method: "post"
  },
  fileRoot: {
    url: "/file",
    method: "get"
  },

  viewDocumentText: {
    url: "/sczb-URL-prefix/report/getTextByBwId",
    method: "get"
  },
  saveReportAttribute: {
    url: "/sczb-URL-prefix/report/updateBwSettings",
    method: "post"
  },
  setManager: {
    url: "/sczb-URL-prefix/user/setManager",
    method: "post"
  },
  abstractContent: {
    url: "ABSTRACT-URL-prffix/summary",
    bodyType: "application/json",
    method: "post"
  },
  previewPdf: {
    url: "/sczb-URL-prefix/cm/read/"
  },
  getMaterialParam: {
    url: "sczb-URL-prefix/index_sczb/sc_info",
    method: "get"
  },
  saveAbstract: {
    // 2020.8.3liuhan修改
    // url: "ES-URL-prefix/index_sczb/sc_info/saveOrUpdate",
    // method: "post"
    url: "sczb-URL-prefix/original/sc/saveOrUpdateAbstract",
    method: "post"
  },
  produceReport: {
    // url: "sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/report",
    url: "sczb-URL-prefix/cm/editor_area_info/saveOrUpdate/cm",
    method: "post"
  },
  checkContent: {
    url: "/languageTool/check",
    method: "post"
  },

  saveAbstractRule: {
    url: "sczb-URL-prefix/zygz/saveOrUpdate",
    method: "post"
  },
  elementRelated: {
    url: "sczb-URL-prefix/index_sczb/sc_info/page/element",
    method: "get"
  },
  otherRelated: {
    url: "sczb-URL-prefix/index_sczb/sc_info/page/cm",
    method: "get"
  },

  fwbscList: {
    url: "sczb-URL-prefix/index_sczb/sc_info/page/cm/fwb",
    method: "post",
    bodyType: "application/json"
  },
  cpbwList: {
    url: "sczb-URL-prefix/index_sczb/tscp_info/page/cm",
    method: "get"
  },

  // 审核接口
  fanyijiaoshen: {
    url: "sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/sh",
    methods: "post"
  },
  // 审核接口
  shenhe: {
    url: "sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/sh",
    methods: "post"
  },
  addFolderItem: {
    url: "/CM-URL-prefix/db_sczb/group_info",
    method: "put"
  },
  deleteFolderItem: {
    url: "/CM-URL-prefix/db_sczb/group_info",
    method: "delete"
  },

  // 多篇预览
  Multview: {
    url: "ES-URL-prefix/index_sczb/sc_info/list",
    method: "post"
  },
  deleteMultiMaterial: {
    url: "/sczb-URL-prefix/index_sczb/sc_db_user/group/_delete",
    method: "post"
  },

  addTranslateTask: {
    url: "/sczb-URL-prefix/sc_dy_info/_batch",
    method: "post"
  },
  pressRecordTable: {
    url: "/ES-URL-prefix/index_sczb/tscp_info/page",
    method: "get"
  },
  // 分类管理列表
  fenleiManageTable: {
    url: "/sczb-URL-prefix/fl/page",
    method: "get"
  },
  // 分类管理删除
  fenleiManageDelete: {
    url: "sczb-URL-prefix/fl/",
    method: "delete"
  },
  // 分类管理批量删除
  fenleiMnageMultDelete: {
    url: "sczb-URL-prefix/fl/",
    method: "post"
  },
  // 分类管理编辑
  fenleiManageEdit: {
    url: "sczb-URL-prefix/fl/saveOrUpdate",
    method: "post"
  },
  // 分类管理新增
  fenleiManageAdd: {
    url: "sczb-URL-prefix/fl/saveOrUpdate",
    method: "post"
  },
  // 要素管理列表
  yaosuManageTable: {
    url: "sczb-URL-prefix/ys/page",
    method: "get"
  },
  // 要素管理编辑
  yaosuManageEdit: {
    url: "sczb-URL-prefix/ys/saveOrUpdate",
    method: "post"
  },
  // 要素管理删除
  yaosuManageDelete: {
    url: "sczb-URL-prefix/ys/",
    method: "delete"
  },
  // 要素管理批量删除
  yaosuMnageMultDelete: {
    url: "sczb-URL-prefix/ys/",
    method: "post"
  },
  // 要素管理新增
  yaosuManageAdd: {
    url: "sczb-URL-prefix/ys/saveOrUpdate",
    method: "post"
  },
  downloadPressRecord: {
    url: "/sczb-URL-prefix/cm/log_file/download",
    method: "get"
  },
  downloadMultiRecord: {
    url: "/sczb-URL-prefix/cm/log_file/_batch",
    method: "get"
  },

  previewfile: {
    url: "/sczb-URL-prefix/cm/download",
    method: "get"
  },
  downloadMould: {
    url: "/sczb-URL-prefix/cm/mbgl_info/download",
    method: "get"
  },
  downloadMultiMould: {
    url: "/sczb-URL-prefix/cm/mbgl_info/_batch",
    method: "get"
  },
  deleteMould: {
    url: "/sczb-URL-prefix/cm/mbgl_info/download",
    method: "delete"
  },
  deleteMultiMould: {
    url: "/CM-URL-prefix/db_sczb/mbgl_info/_delete",
    method: "post"
  },
  deleteMultiProduct: {
    url: "/ES-URL-prefix/index_sczb/tscp_info",
    method: "delete"
  },
  productDataTable: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/page/tscp",
    method: "get"
  },
  //申请校译
  requestTransCheck: {
    url: "/sczb-URL-prefix/trans/toCheck",
    method: "post"
  },
  //完成校译任务
  submitCompleteCheck: {
    url: "/sczb-URL-prefix/trans/complete_check",
    method: "post"
  },
  //保存翻译结果:
  saveTranslateResult: {
    url: "/sczb-URL-prefix/trans/result/saveOrUpdate",
    method: "post"
  },
  //发布翻译任务
  publishTranslateTask: {
    url: "/sczb-URL-prefix/trans/publish",
    method: "post"
  },
  //发布翻译任务
  submitCooperateTask: {
    url: "/sczb-URL-prefix/trans/assistToTj/",
    method: "post"
  },
  cpshDataTable: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/page/cpsh",
    method: "get"
  },

  produceAbstract: {
    url: "/sczb-URL-prefix/sc/scAbstract",
    method: "post"
  },
  extractKeywords: {
    url: "/sczb-URL-prefix/sc/scEntity",
    method: "post"
  },
  cpbwDataTable: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/page/cpbw",
    method: "get"
  },
  downloadProduct: {
    url: "/sczb-URL-prefix/download/index_sczb/tscp_info/_one",
    method: "get"
  },
  downloadMultiProduct: {
    url: "/sczb-URL-prefix/download/index_sczb/tscp_info/_batch",
    method: "get"
  },
  deleteProduct: {
    url: "/ES-URL-prefix/index_sczb/tscp_info",
    method: "delete"
  },
  submitCheckRequest: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/sb",
    method: "post"
  },
  submitComment: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/sh",
    method: "post"
  },
  cpshComment: {
    url: "/sczb-URL-prefix/audit/tscp",
    method: "post"
  },
  /*cpshComment: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/cpsh",
    method: "post"
  },*/
  translateMaterialTable: {
    url: "/sczb-URL-prefix/index_sczb/sc_info/page/trans",
    method: "get"
  },
  deleteTranslateMaterial: {
    url: "/CM-URL-prefix/db_sczb/sc_dy_info/",
    method: "delete"
  },
  deleteMultiTranslate: {
    url: "/CM-URL-prefix/db_sczb/sc_dy_info/_delete",
    method: "post"
  },
  userInfoTable: {
    url: "/sczb-URL-prefix/cm/getUsersXt",
    method: "get"
  },
  cooperatorRequest: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/saveOrUpdate/task",
    method: "post"
  },
  translateTaskTable: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/page/task",
    method: "get"
  },
  fyshTaskTable: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/page/fysx",
    method: "get"
  },
  translateTaskInfo: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/",
    method: "get"
  },
  translateDetailInfo: {
    url: "/sczb-URL-prefix/index_sczb/sc_info/",
    method: "get"
  },
  saveTranslateDetail: {
    url: "/ES-URL-prefix/index_sczb/translate_result_info/saveOrUpdate",
    method: "post"
  },
  submitCheckTranslate: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/saveOrUpdate/toSh",
    method: "post"
  },
  submitCommentTranslate: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/saveOrUpdate/sh",
    method: "post"
  },
  addForEditing: {
    url: "/sczb-URL-prefix/cm/_batch",
    method: "post"
  },
  translateContent: {
    url: "/TRANSLATE-URL-prefix/",
    method: "post"
  },
  addModuleItem: {
    url: "/sczb-URL-prefix/mbgl/saveOrUpdate",
    method: "post"
  },
  //非文本素材路径
  fwbSucai: {
    url: "/api/cm/read/"
  },
  htmlFilePath: {
    //url: "http://192.168.20.72:8882/"
    url: "/"
  },

  //更新用户角色信息
  updateUserRoles: {
    url: "/sczb-URL-prefix/user/userRoles",
    method: "post"
  },
  //查询角色权限列表
  getRoleMenuItemList: {
    url: "/sczb-URL-prefix/role/perms/",
    method: "get"
  },
  //查询权限树
  getAllMenuItemList: {
    url: "/sczb-URL-prefix//perm/perms",
    method: "get"
  },
  //更新角色权限
  updateRoleMenuItemList: {
    url: "/sczb-URL-prefix/role/rolePerms",
    method: "post"
  },
  //增加或编辑角色
  updateRoleItem: {
    url: "/sczb-URL-prefix/role/saveOrUpdate",
    method: "post"
  },
  deleteRoleItem: {
    url: "/sczb-URL-prefix/role/",
    method: "delete"
  },
  // 新增整编任务
  createzbtask: {
    url: "/sczb-URL-prefix/report/saveOrUpdate",
    method: "post"
  },
  // 整编任务提交审核
  submitZbrwToShenhe: {
    url: "/sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/tj",
    method: "post"
  },


  //获取素材翻译协助任务列表
  getCooperatorTaskList: {
    url: "sczb-URL-prefix/trans/getAssistResult",
    method: "get"
  },

  // 向已有整编任务增加素材
  zbrwAddsuci: {
    url: "sczb-URL-prefix/report/addSc",
    method: "post"
  },
  bisengEditor: {
    url: "http://192.168.20.63/apps/editor",
    method: "get"
  },
  biseng: {
    url: "biseng",
    method: "get"
  },

  // 编辑区素材删除
  removeSC: {
    url: "sczb-URL-prefix/report/remove_sc",
    method: "post"
  },
  // 翻译任务

  // 翻译任务素材列表
  translateSucaiList: {
    url: "sczb-URL-prefix/trans/task/sc_list",
    method: "get"
  },
  // 翻译任务翻译协助者
  getxiezhuzhe: {
    url: "sczb-URL-prefix/dept/deptTreeAndUsers",
    method: "get"
  },
  // 翻译任务创建协助任务表单提交方法
  submitxiezhutask: {
    url: "sczb-URL-prefix/trans/assist_task",
    method: "post"
  },
  //  翻译库增量训练-列表
  translateList: {
    url: "/transApi/increment/model/queryPage",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库增量训练-单条删除
  translateItemDel: {
    url: "/transApi/increment/model/delete",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库增量训练-上传文件
  translateUp: {
    url: "/transApi/increment/model/uploadAndTrain",
    method: "post",
    bodyType: "multipart/form-data"
  },
  //  翻译库增量训练-加载模型
  translateLoad: {
    url: "/transApi/increment/model/load",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库增量训练-重新训练
  translateReTrain: {
    url: "/transApi/increment/model/reTrain",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库增量训练-查看模型文件列表
  translateFileView: {
    url: "/transApi/increment/model/fileView",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-列表
  sykList: {
    url: "/transApi/term/queryPage",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-单个删除
  sykDelete: {
    url: "/transApi/term/delete",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-批量删除
  sykListsDelete: {
    url: "/transApi/term/batchDelete",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-targetSent数据更新
  sykUpdate: {
    url: "/transApi/term/update",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-数据查询
  sykGet: {
    url: "/transApi/term/get",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-添加术语
  sykInsert: {
    url: "/transApi/term/insert",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库术语库-文件上传
  sykInsertByFiles: {
    url: "/transApi/term/insertByFiles",
    method: "post",
    bodyType: "multipart/form-data"
  },
  //  翻译库记忆库-列表
  jykList: {
    url: "/transApi/memory/queryPage",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-单个删除
  jykDelete: {
    url: "/transApi/memory/delete",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-批量删除
  jykListsDelete: {
    url: "/transApi/memory/batchDelete",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-targetSent数据更新
  jykUpdate: {
    url: "/transApi/memory/update",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-数据查询
  jykGet: {
    url: "/transApi/memory/get",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-添加记忆
  jykInsert: {
    url: "/transApi/memory/insert",
    method: "post",
    bodyType: "application/json"
  },
  //  翻译库记忆库-文件上传
  jykInsertByFiles: {
    url: "/transApi/memory/insertByFiles",
    method: "post",
    bodyType: "multipart/form-data"
  },
  //  文本素材-详情页翻译-自动文本翻译
  dxscDetailDetect: {
    url: "/transApi/text/translate/detect",
    method: "post",
    bodyType: "application/json"
  },
  //  素材翻译-翻译工具-文本翻译
  fygjTxtDetect: {
    url: "/transApi/text/translate",
    method: "post",
    bodyType: "application/json"
  },
  //翻译任务-转让任务
  turnTranstask: {
    url: "/sczb-URL-prefix/original/sc/updateTranslateTask",
    method: "post"
  },
  //报文属性保存
  bwsxseSave: {
    url: "sczb-URL-prefix/sx/saveOrUpdate",
    method: "post"
  },
  //上报单位设置
  sbdwListData: {
    url: "sczb-URL-prefix/setting-bw/page",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //上报单位设置新增或编辑
  sbdwAddList: {
    url: "sczb-URL-prefix/setting-bw/saveOrUpdate",
    method: "post",
    bodyType: "application/x-www-form-urlencoded"
  },
  //获取报文属性列表
  sbdwCheckedList: {
    url: "sczb-URL-prefix/sx/list",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },

  // 报文审核 转交任务
  bwshZhuanjiaoTask: {
    url: "sczb-URL-prefix/index_sczb/tscp_info/saveOrUpdate/changeUser",
    method: "post"
  },
  // 整编任务 转交任务
  zbrwZhuanjiaoTask: {
    url: "sczb-URL-prefix/report/changeReportUser",
    method: "post"
  },
  //文本素材和非文本素材今日入库统计
  todayrktj: {
    url: "sczb-URL-prefix/work/workScLxGroup",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //文本素材和非文本素材累计入库统计
  todayNoTotal: {
    url: "sczb-URL-prefix/work/workScLxGroupLj",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材筛选-统计素材抄报状态
  scCBzt: {
    url: "sczb-URL-prefix/work/workScCb",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材未待编统计
  scWdpTotal: {
    url: "sczb-URL-prefix/work/workScUnDb",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材筛选-总计翻译统计
  scfyTotal: {
    url: "sczb-URL-prefix/work/workScFy",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材筛选-统计素材抄报状态
  sccbTotal: {
    url: "sczb-URL-prefix/work/workScCb",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  // 素材筛选今日加入待编统计
  TotayJoinTotal: {
    url: "sczb-URL-prefix/work/workScToDbTd",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材筛选累计加入待编统计
  oJoinTotal: {
    url: "sczb-URL-prefix/work/workScToDbLj",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //素材筛选累计废弃统计
  oTotaldown: {
    url: "sczb-URL-prefix/work/workScFqLj",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  // 成品管理预览 获取要素chart
  getYaosuChart: {
    url: "sczb-URL-prefix/index_sczb/entity_info/alltype/list",
    method: "get"
  },
  // 成品管理预览 根据要素节点请求数据
  getyaosuList: {
    url: "sczb-URL-prefix/index_sczb/entity_info/scinfo/list",
    method: "get"
  },

  //控制台素材翻译累计未完成任务统计
  controlFYTotal: {
    url: "sczb-URL-prefix/work/workNoFinTj",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //控制台素材翻译累计今日任务统计
  controlFYTotay: {
    url: "sczb-URL-prefix/work/workTodayaddOrFinshed",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //控制台素材翻译已完成任务统计
  controlNoneTotal: {
    url: "sczb-URL-prefix/work/workAllfinishTj",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //今日报文统计
  paperTotal: {
    url: "sczb-URL-prefix/work/workCpcheckTodayandFinshed",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //今日成品统计
  totayCPtotal: {
    url: "sczb-URL-prefix/work/workCpcheckAddorPublic",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //分类管理添加编辑
  flglSaveOrUpdate: {
    url: "sczb-URL-prefix/fl/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  //分类管理批量删除
  flglBatchDelete: {
    url: "sczb-URL-prefix/fl",
    method: "post",
    bodyType: "application/json"
  },
  //方向管理添加编辑
  fxglSaveOrUpdate: {
    url: "sczb-URL-prefix/fx/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  //方向管理批量删除
  fxglBatchDelete: {
    url: "sczb-URL-prefix/fx",
    method: "post",
    bodyType: "application/json"
  },
  //素材筛选-整编出报-待用素材
  dysc: {
    url: "sczb-URL-prefix/work/workScDb",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  // 素材筛选-整编出报-整编任务
  zbrwTotal: {
    url: "sczb-URL-prefix/work/workDbTask",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  // 素材筛选-素材本地上传
  scscUpload: {
    url: "sczb-URL-prefix/scsc/upload",
    method: "post",
    bodyType: "multipart/form-data"
  },
  translatewfqdTaskTable: {
    url: "/sczb-URL-prefix/index_sczb/translate_task_info/page/myself",
    method: "get"
  },
  //算法配置
  tralcRepaireLoad: {
    url: "sczb-URL-prefix/sx/sxlist",
    method: "get",
    bodyType: "application/x-www-form-urlencoded"
  },
  //算法配置列表更新
  listFetchTralc: {
    url: "sczb-URL-prefix/sx/saveOrUpdateYsgz",
    method: "post"
  },
  //设置上报权限
  setShangbao: {
    url: "sczb-URL-prefix/user/setShangbao",
    method: "post"
  },
  //翻译--词典翻译
  querytranslate: {
    url: "sczb-URL-prefix/fygj/querytranslate",
    method: "get"
  },
  //素材详情修改地域信息
  scSaveOrUpdate: {
    url: "sczb-URL-prefix/sc/saveOrUpdate",
    method: "post",
    bodyType: "application/json"
  },
  //同步到词库
  toTBck: {
    url: "sczb-URL-prefix/tyc/synonyms",
    method: "post",
    bodyType: "application/json"
  },
};

// export default InterfaceConfig
