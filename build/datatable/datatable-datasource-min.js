YUI.add("datatable-datasource",function(B){function A(){A.superclass.constructor.apply(this,arguments);}B.mix(A,{NS:"datasource",NAME:"dataTableDataSource",ATTRS:{datasource:{setter:"_setDataSource"},initialRequest:{setter:"_setInitialRequest"}}});B.extend(A,B.Plugin.Base,{_setDataSource:function(C){return C||new B.DataSource.Local(C);},_setInitialRequest:function(C){},initializer:function(C){if(!B.Lang.isUndefined(C.initialRequest)){this.load({request:C.initialRequest});}},load:function(C){C=C||{};C.request=C.request||this.get("initialRequest");C.callback=C.callback||{success:B.bind(this.onDataReturnInitializeTable,this),failure:B.bind(this.onDataReturnInitializeTable,this),argument:this.get("host").get("state")};var D=(C.datasource||this.get("datasource"));if(D){D.sendRequest(C);}},onDataReturnInitializeTable:function(C){this.get("host").set("recordset",new B.Recordset({records:C.response.results}));}});B.namespace("Plugin").DataTableDataSource=A;},"@VERSION@",{requires:["datatable-base","plugin","datasource-local"]});