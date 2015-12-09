XMLDisplay
===

A JS component to pretty-display XML data, with collapsible nodes.

Original code from:
http://www.levmuchnik.net/Content/ProgrammingTips/WEB/XMLDisplay/DisplayXMLFileWithJavascript.html

IE9 compatible.


API:

   * needs a holder element, with some id
   * `LoadXMLUrl('holder_id', "..url..")` - retrieve data via HTTP GET
   * `LoadXMLString('holder_id', "<xml...")` - load from XML string
   * `LoadXMLDom('holder_id', DOM_root)` - load from a DOM node
   * `$(jquery_selector).xmlDisplay(xml_string)` - same as LoadXMLString
