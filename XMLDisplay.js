// public

function LoadXMLUrl(ParentElementID, url) {
  $.get(url, function(xmlString) {
    LoadXMLString(ParentElementID, xmlString);
  }, "xml");
}

function LoadXMLDom(ParentElementID, xmlDoc) {
  if (xmlDoc) {
    var xmlHolderElement = GetParentElement(ParentElementID);
    if (xmlHolderElement == null) {
      return false;
    }

    while (xmlHolderElement.childNodes.length) {
      xmlHolderElement.removeChild(xmlHolderElement.childNodes.item(xmlHolderElement.childNodes.length - 1));
    }

    var Result = ShowXML(xmlHolderElement, xmlDoc.documentElement, 0);
    return Result;
  } else {
    return false;
  }
}

function LoadXMLString(ParentElementID, XMLString) {
  var xmlDoc = CreateXMLDOM(XMLString);
  return LoadXMLDom(ParentElementID, xmlDoc);
}


// private

function GetParentElement(ParentElementID) {
  if (typeof(ParentElementID) == "string") {
    return document.getElementById(ParentElementID);
  } else if (typeof(ParentElementID) == "object") {
    return ParentElementID;
  } else {
    return null;
  }
}

function URLReceiveCallback(httpRequest, xmlHolderElement) {
  try {
    if (httpRequest.readyState == 4) {
      if (httpRequest.status == 200) {
        var xmlDoc = httpRequest.responseXML;
        if (xmlHolderElement && xmlHolderElement != null) {
          xmlHolderElement.innerHTML = "";
          return LoadXMLDom(xmlHolderElement, xmlDoc);
        }
      } else {
        return false;
      }
    }
  } catch(e) {
    return false;
  }
}

// based on: http://developer.mozilla.org/en/docs/AJAX:Getting_Started
function RequestURL(url, callback, ExtraData) {
  var httpRequest;
  if (window.XMLHttpRequest) {
    // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) {
      httpRequest.overrideMimeType("text/xml");
    }
  } else if (window.ActiveXObject) {
    // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }

  if (!httpRequest) {
    return false;
  }

  httpRequest.onreadystatechange = function() {
    callback(httpRequest, ExtraData);
  };

  httpRequest.open("GET", url, true);
  httpRequest.send("");
  return true;
}

function CreateXMLDOM(XMLStr) {
  if (window.ActiveXObject) {
    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.loadXML(XMLStr);
    return xmlDoc;
  } else if (document.implementation && document.implementation.createDocument) {
    var parser = new DOMParser();
    return parser.parseFromString(XMLStr, "text/xml");
  } else {
    return null;
  }
}

var IDCounter = 1;
var NestingIndent = 15;
function ShowXML(xmlHolderElement, RootNode, indent) {
  if (RootNode == null || xmlHolderElement == null) {
    return false;
  }

  var Result = true;
  var TagEmptyElement = document.createElement("div");
  TagEmptyElement.className = "Element";
  TagEmptyElement.style.position = "relative";
  TagEmptyElement.style.left = NestingIndent + "px";

  var ClickableElement = AddTextNode(TagEmptyElement, "+", "Clickable");
  ClickableElement.onclick = function() {
    ToggleElementVisibility(this);
  };
  ClickableElement.id = "div_empty_" + IDCounter;

  AddTextNode(TagEmptyElement, "<", "Utility");
  AddTextNode(TagEmptyElement, RootNode.nodeName , "NodeName");
  for (var i = 0; RootNode.attributes && i < RootNode.attributes.length; ++i) {
    var CurrentAttribute = RootNode.attributes.item(i);
    AddTextNode(TagEmptyElement, " " + CurrentAttribute.nodeName , "AttributeName");
    AddTextNode(TagEmptyElement, "=", "Utility");
    AddTextNode(TagEmptyElement, "\"" + CurrentAttribute.nodeValue + "\"", "AttributeValue");
  }

  AddTextNode(TagEmptyElement, "> </", "Utility");
  AddTextNode(TagEmptyElement, RootNode.nodeName, "NodeName");
  AddTextNode(TagEmptyElement, ">", "Utility");
  xmlHolderElement.appendChild(TagEmptyElement);
  $(TagEmptyElement).hide();

  var TagElement = document.createElement("div");
  TagElement.className = "Element";
  TagElement.style.position = "relative";
  TagElement.style.left = NestingIndent + "px";
  ClickableElement = AddTextNode(TagElement, "-", "Clickable");
  ClickableElement.onclick = function() {
    ToggleElementVisibility(this);
  };
  ClickableElement.id = "div_content_" + IDCounter;
  ++IDCounter;
  AddTextNode(TagElement, "<", "Utility");
  AddTextNode(TagElement, RootNode.nodeName , "NodeName");

  for (var i = 0; RootNode.attributes && i < RootNode.attributes.length; ++i) {
    var CurrentAttribute = RootNode.attributes.item(i);
    AddTextNode(TagElement, " " + CurrentAttribute.nodeName , "AttributeName");
    AddTextNode(TagElement, "=", "Utility");
    AddTextNode(TagElement, "\"" + CurrentAttribute.nodeValue + "\"", "AttributeValue");
  }
  AddTextNode(TagElement, ">", "Utility");
  TagElement.appendChild(document.createElement("br"));
  var NodeContent = null;
  for (var i = 0; RootNode.childNodes && i < RootNode.childNodes.length; ++i) {
    if (RootNode.childNodes.item(i).nodeName != "#text") {
      Result &= ShowXML(TagElement, RootNode.childNodes.item(i), indent + 1);
    } else {
      NodeContent = RootNode.childNodes.item(i).nodeValue;
    }
  }
  if (RootNode.nodeValue) {
    NodeContent = RootNode.nodeValue;
  }
  if (NodeContent) {
    var ContentElement = document.createElement("div");
    ContentElement.style.position = "relative";
    ContentElement.style.left = NestingIndent + "px";
    AddTextNode(ContentElement, NodeContent , "NodeValue");
    TagElement.appendChild(ContentElement);
  }
  AddTextNode(TagElement, " </", "Utility");
  AddTextNode(TagElement, RootNode.nodeName, "NodeName");
  AddTextNode(TagElement, ">", "Utility");
  xmlHolderElement.appendChild(TagElement);

  return Result;
}

function AddTextNode(ParentNode, Text, Class) {
  var NewNode = document.createElement("span");

  if (Class) {
    NewNode.className = Class;
  }
  if (Text) {
    NewNode.appendChild(document.createTextNode(Text));
  }
  if (ParentNode) {
    ParentNode.appendChild(NewNode);
  }

  return NewNode;
}

function ToggleElementVisibility(Element) {
  if (!Element|| !Element.id) {
    return;
  }

  try {
    var ElementType = Element.id.slice(0, Element.id.lastIndexOf("_") + 1);
    var ElementID = parseInt(Element.id.slice(Element.id.lastIndexOf("_") + 1));
  } catch(e) {
    return;
  }

  var ElementToHide = null;
  var ElementToShow = null;
  if (ElementType == "div_content_") {
    ElementToHide = "div_content_" + ElementID;
    ElementToShow = "div_empty_" + ElementID;
  } else if (ElementType == "div_empty_") {
    ElementToShow = "div_content_" + ElementID;
    ElementToHide = "div_empty_" + ElementID;
  }

  ElementToHide = document.getElementById(ElementToHide);
  ElementToShow = document.getElementById(ElementToShow);

  if (ElementToHide) {
    ElementToHide = ElementToHide.parentNode;
  }
  if (ElementToShow) {
    ElementToShow = ElementToShow.parentNode;
  }

  $(ElementToHide).hide();
  $(ElementToShow).show();
}
