+dynamic diagram myDiagram {<% loop $Classes %>
  [@$posLeft,$posTop]
  class $className<% if parent %> : $parent<% end_if %> {
    <% loop fields %><% if DataType %>Attribute $FieldName : $FieldType;<% end_if %>
    <% end_loop %>
  }
<% end_loop %>
}
