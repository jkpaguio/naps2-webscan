var gn = Object.defineProperty;
var mn = (e, t, n) => t in e ? gn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var bn = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var z = (e, t, n) => mn(e, typeof t != "symbol" ? t + "" : t, n);
var xi = bn((_, Ne) => {
  const yn = {
    ERROR_UNKNOWN_ERROR: "ERR_00001",
    ERROR_PRINTER_UNAVAILABLE: "ERR_00002",
    ERROR_PRINTER_INFO: "ERR_00003",
    ERROR_PRINT_IMAGE: "ERR_00003",
    ERROR_UNSUPPORT_FILE_TYPE: "ERR_00004",
    ERROR_PRINERT_IS_BUSY: "ERR_00005",
    ERROR_PRINT_JOB_INFO: "ERR_00006"
  }, En = {
    STATE_IDLE: "Idle",
    //空闲状态，可能会有状态警告，可以提交打印任务
    STATE_STOP: "Stopped",
    //停止状态，有状态错误，不能提交打印任务
    STATE_TESTING: "Testing",
    //正在准备，不能提交打印任务
    STATE_DOWN: "Down",
    //打印机有问题，不能提交打印任务
    STATE_PROCESSING: "Processing"
    //处理打印任务中，不能提交打印任务
  }, wn = {
    STATE_CANCELED: "Canceled",
    //end state 最终状态 扫描任务被取消
    STATE_ABORTED: "Aborted",
    //end state 最终状态 扫描任务被放弃
    STATE_TESTING: "Completed",
    //扫描完成
    STATE_DOWN: "Pending",
    // 扫描正在排队
    STATE_PROCESSING: "Processing"
    // 扫描任务正在进行
  }, wt = [
    "Grayscale8",
    "RGB24"
  ], M = [
    {
      label: "A4",
      Height: 3507,
      Width: 2481,
      XOffset: 0,
      YOffset: 0
    },
    {
      label: "Letter",
      Height: 3300,
      Width: 2550,
      XOffset: 0,
      YOffset: 0
    },
    {
      label: "5x7 in.",
      Height: 2100,
      Width: 1500,
      XOffset: 0,
      YOffset: 0
    },
    {
      label: "4x6 in.",
      Height: 1800,
      Width: 1200,
      XOffset: 0,
      YOffset: 0
    },
    {
      label: "10x15 cm",
      Height: 1771,
      Width: 1181,
      XOffset: 0,
      YOffset: 0
    }
  ], Nn = [
    {
      label: "Screen 75dpi",
      xResolution: 75,
      yResolution: 75
    },
    {
      label: "Photo 200dpi",
      xResolution: 200,
      yResolution: 200
    },
    {
      label: "Text 300dpi",
      xResolution: 300,
      yResolution: 300
    },
    {
      label: "Height 600dpi",
      xResolution: 600,
      yResolution: 600
    }
  ], ue = ["image/jpeg", "application/pdf"], Nt = "http://schemas.hp.com/imaging/escl/2011/05/03", Sn = "http://www.hp.com/schemas/imaging/con/copy/2008/07/07", Tn = "http://www.hp.com/schemas/imaging/con/dictionaries/1.0/", Rn = "http://www.hp.com/schemas/imaging/con/dictionaries/2009/04/06", On = "http://www.hp.com/schemas/imaging/con/firewall/2011/01/05", An = "http://schemas.hp.com/imaging/escl/2011/05/03", St = "http://www.pwg.org/schemas/2010/12/sm", Tt = "http://schemas.hp.com/imaging/httpdestination/2011/10/13", E = {
    Version: "pwg:Version",
    Intent: "scan:Intent",
    ScanRegions: "pwg:ScanRegions",
    ScanRegion: "pwg:ScanRegion",
    Height: "pwg:Height",
    Width: "pwg:Width",
    XOffset: "pwg:XOffset",
    YOffset: "pwg:YOffset",
    InputSource: "pwg:InputSource",
    XResolution: "scan:XResolution",
    YResolution: "scan:YResolution",
    ColorMode: "scan:ColorMode",
    Brightness: "scan:Brightness",
    Contrast: "scan:Contrast",
    CompressionFactor: "scan:CompressionFactor",
    DocumentFormatExt: "scan:DocumentFormatExt",
    DocumentFormat: "scan:DocumentFormat",
    Duplex: "scan:Duplex",
    Resolution: "scan:Resolution",
    ScanDestinations: "scan:ScanDestinations",
    DestinationUri: "pwg:DestinationUri",
    ReferenceID: "dest:ReferenceID",
    RetryInfo: "pwg:RetryInfo",
    NumberOfRetries: "pwg:NumberOfRetries",
    RetryInterval: "pwg:RetryInterval",
    RetryTimeOut: "pwg:RetryTimeOut",
    JobOriginatingUserName: "pwg:JobOriginatingUserName",
    JobPassword: "pwg:JobPassword",
    HttpMethod: "dest:HttpMethod",
    HttpHeaders: "dest:HttpHeaders",
    HttpHeader: "dest:HttpHeader",
    CertificateValidation: "dest:CertificateValidation",
    HttpDestination: "dest:HttpDestination"
  };
  Ne.exports = {
    ERROR_CODE: yn,
    RESOLUTIONS: Nn,
    DOCUMENT_FORMART: ue,
    PAPPER_PAGE_SIZE: M,
    XMLNS_PWG: St,
    XMLNS_SCC: An,
    XMLNS_FW: On,
    XMLNS_DD3: Rn,
    XMLNS_DD: Tn,
    XMLNS_COPY: Sn,
    XMLNS_SCAN: Nt,
    SCAN_SETTING_KEY_MAP: E,
    JOB_STATE: wn,
    SCANNER_STATE: En,
    SUPPORED_COLOR_MODES: wt,
    XMLNS_DEST: Tt
  };
  var Ze = function(e, t, n) {
    if (n || arguments.length === 2) for (var r = 0, s = t.length, i; r < s; r++)
      (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
    return e.concat(i || Array.prototype.slice.call(t));
  };
  Object.defineProperty(_, "__esModule", { value: !0 });
  _.formatScannerLEDMInfo = _.getArrayCommonItem = _.getMaxValOfArrByKey = _.arraySortByKey = _.ab2string = void 0;
  function Cn(e) {
    for (var t = new Uint8Array(e), n = "", r = 0, s = 0, i = 0, o = t.length; i < o; ++i) {
      var a = t[i];
      if (s > 0)
        if ((r & 192) === 192)
          r = r << 6 | a & 63;
        else
          throw new Error("this is no tailing-byte");
      else if (a < 128)
        s = 1, r = a;
      else {
        if (a < 192)
          throw new Error("invalid byte, this is a tailing-byte");
        if (a < 224)
          s = 2, r = a & 31;
        else if (a < 240)
          s = 3, r = a & 15;
        else
          throw new Error("invalid encoding, value out of range");
      }
      --s === 0 && (n += String.fromCharCode(r));
    }
    if (s)
      throw new Error("the bytes don't sum up");
    return n;
  }
  _.ab2string = Cn;
  function Rt(e, t) {
    return e.sort(function(n, r) {
      return Number(n[t]) - Number(r[t]);
    }), e;
  }
  _.arraySortByKey = Rt;
  function Pn(e, t) {
    var n = Rt(e, t);
    return {
      min: n[0],
      max: n[n.length - 1]
    };
  }
  _.getMaxValOfArrByKey = Pn;
  function Ot(e, t) {
    var n = Ze(Ze([], e, !0), t, !0), r = [];
    return n.sort().sort(function(s, i) {
      return s === i && r.indexOf(s) === -1 && r.push(s), 1;
    }), r;
  }
  _.getArrayCommonItem = Ot;
  function _e(e) {
    if (!e)
      return {};
    var t = {};
    for (var n in e) {
      var r = n.split(":")[1];
      if (Array.isArray(e[n])) {
        t[r] = [];
        for (var s = e[n], i = 0; i < s.length; i++)
          typeof s[i] == "object" ? t[r].push(_e(s[i])) : t[r].push(s[i]);
      } else typeof e[n] == "object" ? t[r] = _e(e[n]) : t[r] = e[n];
    }
    return t;
  }
  _.formatScannerLEDMInfo = _e;
  const Re = (e) => {
    let t = {
      default_value: "A4",
      options: [],
      name: "ScanRegions"
    }, n = e["scan:MaxHeight"], r = e["scan:MinHeight"], s = e["scan:MaxWidth"], i = e["scan:MinWidth"];
    for (let o = 0; o < M.length; o++) {
      let a = M[o];
      a.Height > r && a.Height < n && a.Width > i && a.Width < s && t.options.push(a.label);
    }
    return t.default_value = t.options[0], t;
  }, Oe = (e) => {
    let t = {
      default_value: "RGB24",
      options: [],
      name: "ColorMode"
    };
    return t.options = Ot(wt, e["scan:SettingProfiles"]["scan:SettingProfile"]["scan:ColorModes"]["scan:ColorMode"]), t.default_value = t.options[0], t;
  }, Ae = (e) => {
    let t = {
      default_value: 75,
      options: [],
      name: "Resolution"
    }, n = e["scan:SettingProfiles"]["scan:SettingProfile"]["scan:SupportedResolutions"]["scan:DiscreteResolutions"]["scan:DiscreteResolution"];
    for (let r = 0; r < n.length; r++)
      t.options.push(n[r]["scan:XResolution"]);
    return t.default_value = t.options[0], t;
  }, Ce = (e) => {
    let t = {
      default_value: "image/jpeg",
      options: [],
      name: "DocumentFormat"
    }, n = e["scan:SettingProfiles"]["scan:SettingProfile"]["scan:DocumentFormats"]["pwg:DocumentFormat"];
    for (let r = 0; r < ue.length; r++)
      n.findIndex((i) => i == ue[r]) > -1 && t.options.push(ue[r]);
    return t.default_value = t.options[0], t;
  }, xn = (e) => {
    let t = {
      adf: {
        Simplex: [],
        Duplex: [],
        AdfOptions: [],
        FeederCapacity: 0
      },
      platen: []
    };
    return e["scan:ScannerCapabilities"]["scan:Adf"] && (t.adf.Simplex = [
      Re(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfSimplexInputCaps"]),
      Oe(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfSimplexInputCaps"]),
      Ae(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfSimplexInputCaps"]),
      Ce(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfSimplexInputCaps"])
    ], t.adf.FeederCapacity = e["scan:ScannerCapabilities"]["scan:Adf"]["scan:FeederCapacity"], e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfOptions"] && (t.adf.AdfOptions = e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfOptions"]["scan:AdfOption"]), e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfDuplexInputCaps"] && (t.adf.Duplex = [
      Re(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfDuplexInputCaps"]),
      Oe(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfDuplexInputCaps"]),
      Ae(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfDuplexInputCaps"]),
      Ce(e["scan:ScannerCapabilities"]["scan:Adf"]["scan:AdfDuplexInputCaps"])
    ])), e["scan:ScannerCapabilities"]["scan:Platen"] && (t.platen = [
      Re(e["scan:ScannerCapabilities"]["scan:Platen"]["scan:PlatenInputCaps"]),
      Oe(e["scan:ScannerCapabilities"]["scan:Platen"]["scan:PlatenInputCaps"]),
      Ae(e["scan:ScannerCapabilities"]["scan:Platen"]["scan:PlatenInputCaps"]),
      Ce(e["scan:ScannerCapabilities"]["scan:Platen"]["scan:PlatenInputCaps"])
    ]), t;
  }, In = (e) => e["scan:ScannerCapabilities"]["scan:BrightnessSupport"] ? {
    Min: e["scan:ScannerCapabilities"]["scan:BrightnessSupport"]["scan:Min"],
    Max: e["scan:ScannerCapabilities"]["scan:BrightnessSupport"]["scan:Max"],
    Step: e["scan:ScannerCapabilities"]["scan:BrightnessSupport"]["scan:Step"],
    Normal: e["scan:ScannerCapabilities"]["scan:BrightnessSupport"]["scan:Normal"]
  } : null;
  var $e = {}, he = {};
  (function(e) {
    const t = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", n = t + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040", r = "[" + t + "][" + n + "]*", s = new RegExp("^" + r + "$"), i = function(a, c) {
      const f = [];
      let u = c.exec(a);
      for (; u; ) {
        const p = [];
        p.startIndex = c.lastIndex - u[0].length;
        const g = u.length;
        for (let y = 0; y < g; y++)
          p.push(u[y]);
        f.push(p), u = c.exec(a);
      }
      return f;
    }, o = function(a) {
      const c = s.exec(a);
      return !(c === null || typeof c > "u");
    };
    e.isExist = function(a) {
      return typeof a < "u";
    }, e.isEmptyObject = function(a) {
      return Object.keys(a).length === 0;
    }, e.merge = function(a, c, f) {
      if (c) {
        const u = Object.keys(c), p = u.length;
        for (let g = 0; g < p; g++)
          f === "strict" ? a[u[g]] = [c[u[g]]] : a[u[g]] = c[u[g]];
      }
    }, e.getValue = function(a) {
      return e.isExist(a) ? a : "";
    }, e.isName = o, e.getAllMatches = i, e.nameRegexp = r;
  })(he);
  const He = he, _n = {
    allowBooleanAttributes: !1,
    //A tag can have attributes without any value
    unpairedTags: []
  };
  $e.validate = function(e, t) {
    t = Object.assign({}, _n, t);
    const n = [];
    let r = !1, s = !1;
    e[0] === "\uFEFF" && (e = e.substr(1));
    for (let i = 0; i < e.length; i++)
      if (e[i] === "<" && e[i + 1] === "?") {
        if (i += 2, i = De(e, i), i.err) return i;
      } else if (e[i] === "<") {
        let o = i;
        if (i++, e[i] === "!") {
          i = et(e, i);
          continue;
        } else {
          let a = !1;
          e[i] === "/" && (a = !0, i++);
          let c = "";
          for (; i < e.length && e[i] !== ">" && e[i] !== " " && e[i] !== "	" && e[i] !== `
` && e[i] !== "\r"; i++)
            c += e[i];
          if (c = c.trim(), c[c.length - 1] === "/" && (c = c.substring(0, c.length - 1), i--), !Hn(c)) {
            let p;
            return c.trim().length === 0 ? p = "Invalid space after '<'." : p = "Tag '" + c + "' is an invalid name.", w("InvalidTag", p, O(e, i));
          }
          const f = Bn(e, i);
          if (f === !1)
            return w("InvalidAttr", "Attributes for '" + c + "' have open quote.", O(e, i));
          let u = f.value;
          if (i = f.index, u[u.length - 1] === "/") {
            const p = i - u.length;
            u = u.substring(0, u.length - 1);
            const g = tt(u, t);
            if (g === !0)
              r = !0;
            else
              return w(g.err.code, g.err.msg, O(e, p + g.err.line));
          } else if (a)
            if (f.tagClosed) {
              if (u.trim().length > 0)
                return w("InvalidTag", "Closing tag '" + c + "' can't have attributes or invalid starting.", O(e, o));
              if (n.length === 0)
                return w("InvalidTag", "Closing tag '" + c + "' has not been opened.", O(e, o));
              {
                const p = n.pop();
                if (c !== p.tagName) {
                  let g = O(e, p.tagStartPos);
                  return w(
                    "InvalidTag",
                    "Expected closing tag '" + p.tagName + "' (opened in line " + g.line + ", col " + g.col + ") instead of closing tag '" + c + "'.",
                    O(e, o)
                  );
                }
                n.length == 0 && (s = !0);
              }
            } else return w("InvalidTag", "Closing tag '" + c + "' doesn't have proper closing.", O(e, i));
          else {
            const p = tt(u, t);
            if (p !== !0)
              return w(p.err.code, p.err.msg, O(e, i - u.length + p.err.line));
            if (s === !0)
              return w("InvalidXml", "Multiple possible root nodes found.", O(e, i));
            t.unpairedTags.indexOf(c) !== -1 || n.push({ tagName: c, tagStartPos: o }), r = !0;
          }
          for (i++; i < e.length; i++)
            if (e[i] === "<")
              if (e[i + 1] === "!") {
                i++, i = et(e, i);
                continue;
              } else if (e[i + 1] === "?") {
                if (i = De(e, ++i), i.err) return i;
              } else
                break;
            else if (e[i] === "&") {
              const p = vn(e, i);
              if (p == -1)
                return w("InvalidChar", "char '&' is not expected.", O(e, i));
              i = p;
            } else if (s === !0 && !Qe(e[i]))
              return w("InvalidXml", "Extra text at the end", O(e, i));
          e[i] === "<" && i--;
        }
      } else {
        if (Qe(e[i]))
          continue;
        return w("InvalidChar", "char '" + e[i] + "' is not expected.", O(e, i));
      }
    if (r) {
      if (n.length == 1)
        return w("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", O(e, n[0].tagStartPos));
      if (n.length > 0)
        return w("InvalidXml", "Invalid '" + JSON.stringify(n.map((i) => i.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    } else return w("InvalidXml", "Start tag expected.", 1);
    return !0;
  };
  function Qe(e) {
    return e === " " || e === "	" || e === `
` || e === "\r";
  }
  function De(e, t) {
    const n = t;
    for (; t < e.length; t++)
      if (e[t] == "?" || e[t] == " ") {
        const r = e.substr(n, t - n);
        if (t > 5 && r === "xml")
          return w("InvalidXml", "XML declaration allowed only at the start of the document.", O(e, t));
        if (e[t] == "?" && e[t + 1] == ">") {
          t++;
          break;
        } else
          continue;
      }
    return t;
  }
  function et(e, t) {
    if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
      for (t += 3; t < e.length; t++)
        if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
          t += 2;
          break;
        }
    } else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
      let n = 1;
      for (t += 8; t < e.length; t++)
        if (e[t] === "<")
          n++;
        else if (e[t] === ">" && (n--, n === 0))
          break;
    } else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
      for (t += 8; t < e.length; t++)
        if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
          t += 2;
          break;
        }
    }
    return t;
  }
  const Fn = '"', Ln = "'";
  function Bn(e, t) {
    let n = "", r = "", s = !1;
    for (; t < e.length; t++) {
      if (e[t] === Fn || e[t] === Ln)
        r === "" ? r = e[t] : r !== e[t] || (r = "");
      else if (e[t] === ">" && r === "") {
        s = !0;
        break;
      }
      n += e[t];
    }
    return r !== "" ? !1 : {
      value: n,
      index: t,
      tagClosed: s
    };
  }
  const Un = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function tt(e, t) {
    const n = He.getAllMatches(e, Un), r = {};
    for (let s = 0; s < n.length; s++) {
      if (n[s][1].length === 0)
        return w("InvalidAttr", "Attribute '" + n[s][2] + "' has no space in starting.", Q(n[s]));
      if (n[s][3] !== void 0 && n[s][4] === void 0)
        return w("InvalidAttr", "Attribute '" + n[s][2] + "' is without value.", Q(n[s]));
      if (n[s][3] === void 0 && !t.allowBooleanAttributes)
        return w("InvalidAttr", "boolean attribute '" + n[s][2] + "' is not allowed.", Q(n[s]));
      const i = n[s][2];
      if (!$n(i))
        return w("InvalidAttr", "Attribute '" + i + "' is an invalid name.", Q(n[s]));
      if (!r.hasOwnProperty(i))
        r[i] = 1;
      else
        return w("InvalidAttr", "Attribute '" + i + "' is repeated.", Q(n[s]));
    }
    return !0;
  }
  function Mn(e, t) {
    let n = /\d/;
    for (e[t] === "x" && (t++, n = /[\da-fA-F]/); t < e.length; t++) {
      if (e[t] === ";")
        return t;
      if (!e[t].match(n))
        break;
    }
    return -1;
  }
  function vn(e, t) {
    if (t++, e[t] === ";")
      return -1;
    if (e[t] === "#")
      return t++, Mn(e, t);
    let n = 0;
    for (; t < e.length; t++, n++)
      if (!(e[t].match(/\w/) && n < 20)) {
        if (e[t] === ";")
          break;
        return -1;
      }
    return t;
  }
  function w(e, t, n) {
    return {
      err: {
        code: e,
        msg: t,
        line: n.line || n,
        col: n.col
      }
    };
  }
  function $n(e) {
    return He.isName(e);
  }
  function Hn(e) {
    return He.isName(e);
  }
  function O(e, t) {
    const n = e.substring(0, t).split(/\r?\n/);
    return {
      line: n.length,
      // column number is last line's length + 1, because column numbering starts at 1:
      col: n[n.length - 1].length + 1
    };
  }
  function Q(e) {
    return e.startIndex + e[1].length;
  }
  var ke = {};
  const At = {
    preserveOrder: !1,
    attributeNamePrefix: "@_",
    attributesGroupName: !1,
    textNodeName: "#text",
    ignoreAttributes: !0,
    removeNSPrefix: !1,
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: !1,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: !0,
    parseAttributeValue: !1,
    trimValues: !0,
    //Trim string values of tag and attributes
    cdataPropName: !1,
    numberParseOptions: {
      hex: !0,
      leadingZeros: !0,
      eNotation: !0
    },
    tagValueProcessor: function(e, t) {
      return t;
    },
    attributeValueProcessor: function(e, t) {
      return t;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
    alwaysCreateTextNode: !1,
    isArray: () => !1,
    commentPropName: !1,
    unpairedTags: [],
    processEntities: !0,
    htmlEntities: !1,
    ignoreDeclaration: !1,
    ignorePiTags: !1,
    transformTagName: !1,
    transformAttributeName: !1,
    updateTag: function(e, t, n) {
      return e;
    }
    // skipEmptyListItem: false
  }, kn = function(e) {
    return Object.assign({}, At, e);
  };
  ke.buildOptions = kn;
  ke.defaultOptions = At;
  class jn {
    constructor(t) {
      this.tagname = t, this.child = [], this[":@"] = {};
    }
    add(t, n) {
      t === "__proto__" && (t = "#__proto__"), this.child.push({ [t]: n });
    }
    addChild(t) {
      t.tagname === "__proto__" && (t.tagname = "#__proto__"), t[":@"] && Object.keys(t[":@"]).length > 0 ? this.child.push({ [t.tagname]: t.child, ":@": t[":@"] }) : this.child.push({ [t.tagname]: t.child });
    }
  }
  var Vn = jn;
  const qn = he;
  function Xn(e, t) {
    const n = {};
    if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
      t = t + 9;
      let r = 1, s = !1, i = !1, o = "";
      for (; t < e.length; t++)
        if (e[t] === "<" && !i) {
          if (s && zn(e, t)) {
            t += 7;
            let a, c;
            [a, c, t] = Wn(e, t + 1), c.indexOf("&") === -1 && (n[Zn(a)] = {
              regx: RegExp(`&${a};`, "g"),
              val: c
            });
          } else if (s && Gn(e, t)) t += 8;
          else if (s && Kn(e, t)) t += 8;
          else if (s && Yn(e, t)) t += 9;
          else if (Jn) i = !0;
          else throw new Error("Invalid DOCTYPE");
          r++, o = "";
        } else if (e[t] === ">") {
          if (i ? e[t - 1] === "-" && e[t - 2] === "-" && (i = !1, r--) : r--, r === 0)
            break;
        } else e[t] === "[" ? s = !0 : o += e[t];
      if (r !== 0)
        throw new Error("Unclosed DOCTYPE");
    } else
      throw new Error("Invalid Tag instead of DOCTYPE");
    return { entities: n, i: t };
  }
  function Wn(e, t) {
    let n = "";
    for (; t < e.length && e[t] !== "'" && e[t] !== '"'; t++)
      n += e[t];
    if (n = n.trim(), n.indexOf(" ") !== -1) throw new Error("External entites are not supported");
    const r = e[t++];
    let s = "";
    for (; t < e.length && e[t] !== r; t++)
      s += e[t];
    return [n, s, t];
  }
  function Jn(e, t) {
    return e[t + 1] === "!" && e[t + 2] === "-" && e[t + 3] === "-";
  }
  function zn(e, t) {
    return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "N" && e[t + 4] === "T" && e[t + 5] === "I" && e[t + 6] === "T" && e[t + 7] === "Y";
  }
  function Gn(e, t) {
    return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "L" && e[t + 4] === "E" && e[t + 5] === "M" && e[t + 6] === "E" && e[t + 7] === "N" && e[t + 8] === "T";
  }
  function Kn(e, t) {
    return e[t + 1] === "!" && e[t + 2] === "A" && e[t + 3] === "T" && e[t + 4] === "T" && e[t + 5] === "L" && e[t + 6] === "I" && e[t + 7] === "S" && e[t + 8] === "T";
  }
  function Yn(e, t) {
    return e[t + 1] === "!" && e[t + 2] === "N" && e[t + 3] === "O" && e[t + 4] === "T" && e[t + 5] === "A" && e[t + 6] === "T" && e[t + 7] === "I" && e[t + 8] === "O" && e[t + 9] === "N";
  }
  function Zn(e) {
    if (qn.isName(e))
      return e;
    throw new Error(`Invalid entity name ${e}`);
  }
  var Qn = Xn;
  const Dn = /^[-+]?0x[a-fA-F0-9]+$/, er = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, tr = {
    hex: !0,
    // oct: false,
    leadingZeros: !0,
    decimalPoint: ".",
    eNotation: !0
    //skipLike: /regex/
  };
  function nr(e, t = {}) {
    if (t = Object.assign({}, tr, t), !e || typeof e != "string") return e;
    let n = e.trim();
    if (t.skipLike !== void 0 && t.skipLike.test(n)) return e;
    if (e === "0") return 0;
    if (t.hex && Dn.test(n))
      return sr(n, 16);
    if (n.search(/[eE]/) !== -1) {
      const r = n.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
      if (r) {
        if (t.leadingZeros)
          n = (r[1] || "") + r[3];
        else if (!(r[2] === "0" && r[3][0] === ".")) return e;
        return t.eNotation ? Number(n) : e;
      } else
        return e;
    } else {
      const r = er.exec(n);
      if (r) {
        const s = r[1], i = r[2];
        let o = rr(r[3]);
        if (!t.leadingZeros && i.length > 0 && s && n[2] !== ".") return e;
        if (!t.leadingZeros && i.length > 0 && !s && n[1] !== ".") return e;
        if (t.leadingZeros && i === e) return 0;
        {
          const a = Number(n), c = "" + a;
          return c.search(/[eE]/) !== -1 ? t.eNotation ? a : e : n.indexOf(".") !== -1 ? c === "0" && o === "" || c === o || s && c === "-" + o ? a : e : i ? o === c || s + o === c ? a : e : n === c || n === s + c ? a : e;
        }
      } else
        return e;
    }
  }
  function rr(e) {
    return e && e.indexOf(".") !== -1 && (e = e.replace(/0+$/, ""), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substr(0, e.length - 1))), e;
  }
  function sr(e, t) {
    if (parseInt) return parseInt(e, t);
    if (Number.parseInt) return Number.parseInt(e, t);
    if (window && window.parseInt) return window.parseInt(e, t);
    throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
  }
  var ir = nr;
  function or(e) {
    return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
      for (const n of e)
        if (typeof n == "string" && t === n || n instanceof RegExp && n.test(t))
          return !0;
    } : () => !1;
  }
  var Ct = or;
  const Pt = he, D = Vn, ar = Qn, cr = ir, ur = Ct;
  let lr = class {
    constructor(t) {
      this.options = t, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
        apos: { regex: /&(apos|#39|#x27);/g, val: "'" },
        gt: { regex: /&(gt|#62|#x3E);/g, val: ">" },
        lt: { regex: /&(lt|#60|#x3C);/g, val: "<" },
        quot: { regex: /&(quot|#34|#x22);/g, val: '"' }
      }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = {
        space: { regex: /&(nbsp|#160);/g, val: " " },
        // "lt" : { regex: /&(lt|#60);/g, val: "<" },
        // "gt" : { regex: /&(gt|#62);/g, val: ">" },
        // "amp" : { regex: /&(amp|#38);/g, val: "&" },
        // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
        // "apos" : { regex: /&(apos|#39);/g, val: "'" },
        cent: { regex: /&(cent|#162);/g, val: "¢" },
        pound: { regex: /&(pound|#163);/g, val: "£" },
        yen: { regex: /&(yen|#165);/g, val: "¥" },
        euro: { regex: /&(euro|#8364);/g, val: "€" },
        copyright: { regex: /&(copy|#169);/g, val: "©" },
        reg: { regex: /&(reg|#174);/g, val: "®" },
        inr: { regex: /&(inr|#8377);/g, val: "₹" },
        num_dec: { regex: /&#([0-9]{1,7});/g, val: (n, r) => String.fromCharCode(Number.parseInt(r, 10)) },
        num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (n, r) => String.fromCharCode(Number.parseInt(r, 16)) }
      }, this.addExternalEntities = fr, this.parseXml = mr, this.parseTextData = dr, this.resolveNameSpace = pr, this.buildAttributesMap = gr, this.isItStopNode = wr, this.replaceEntitiesValue = yr, this.readStopNodeData = Sr, this.saveTextToParentTag = Er, this.addChild = br, this.ignoreAttributesFn = ur(this.options.ignoreAttributes);
    }
  };
  function fr(e) {
    const t = Object.keys(e);
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      this.lastEntities[r] = {
        regex: new RegExp("&" + r + ";", "g"),
        val: e[r]
      };
    }
  }
  function dr(e, t, n, r, s, i, o) {
    if (e !== void 0 && (this.options.trimValues && !r && (e = e.trim()), e.length > 0)) {
      o || (e = this.replaceEntitiesValue(e));
      const a = this.options.tagValueProcessor(t, e, n, s, i);
      return a == null ? e : typeof a != typeof e || a !== e ? a : this.options.trimValues ? Le(e, this.options.parseTagValue, this.options.numberParseOptions) : e.trim() === e ? Le(e, this.options.parseTagValue, this.options.numberParseOptions) : e;
    }
  }
  function pr(e) {
    if (this.options.removeNSPrefix) {
      const t = e.split(":"), n = e.charAt(0) === "/" ? "/" : "";
      if (t[0] === "xmlns")
        return "";
      t.length === 2 && (e = n + t[1]);
    }
    return e;
  }
  const hr = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function gr(e, t, n) {
    if (this.options.ignoreAttributes !== !0 && typeof e == "string") {
      const r = Pt.getAllMatches(e, hr), s = r.length, i = {};
      for (let o = 0; o < s; o++) {
        const a = this.resolveNameSpace(r[o][1]);
        if (this.ignoreAttributesFn(a, t))
          continue;
        let c = r[o][4], f = this.options.attributeNamePrefix + a;
        if (a.length)
          if (this.options.transformAttributeName && (f = this.options.transformAttributeName(f)), f === "__proto__" && (f = "#__proto__"), c !== void 0) {
            this.options.trimValues && (c = c.trim()), c = this.replaceEntitiesValue(c);
            const u = this.options.attributeValueProcessor(a, c, t);
            u == null ? i[f] = c : typeof u != typeof c || u !== c ? i[f] = u : i[f] = Le(
              c,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          } else this.options.allowBooleanAttributes && (i[f] = !0);
      }
      if (!Object.keys(i).length)
        return;
      if (this.options.attributesGroupName) {
        const o = {};
        return o[this.options.attributesGroupName] = i, o;
      }
      return i;
    }
  }
  const mr = function(e) {
    e = e.replace(/\r\n?/g, `
`);
    const t = new D("!xml");
    let n = t, r = "", s = "";
    for (let i = 0; i < e.length; i++)
      if (e[i] === "<")
        if (e[i + 1] === "/") {
          const a = V(e, ">", i, "Closing Tag is not closed.");
          let c = e.substring(i + 2, a).trim();
          if (this.options.removeNSPrefix) {
            const p = c.indexOf(":");
            p !== -1 && (c = c.substr(p + 1));
          }
          this.options.transformTagName && (c = this.options.transformTagName(c)), n && (r = this.saveTextToParentTag(r, n, s));
          const f = s.substring(s.lastIndexOf(".") + 1);
          if (c && this.options.unpairedTags.indexOf(c) !== -1)
            throw new Error(`Unpaired tag can not be used as closing tag: </${c}>`);
          let u = 0;
          f && this.options.unpairedTags.indexOf(f) !== -1 ? (u = s.lastIndexOf(".", s.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : u = s.lastIndexOf("."), s = s.substring(0, u), n = this.tagsNodeStack.pop(), r = "", i = a;
        } else if (e[i + 1] === "?") {
          let a = Fe(e, i, !1, "?>");
          if (!a) throw new Error("Pi Tag is not closed.");
          if (r = this.saveTextToParentTag(r, n, s), !(this.options.ignoreDeclaration && a.tagName === "?xml" || this.options.ignorePiTags)) {
            const c = new D(a.tagName);
            c.add(this.options.textNodeName, ""), a.tagName !== a.tagExp && a.attrExpPresent && (c[":@"] = this.buildAttributesMap(a.tagExp, s, a.tagName)), this.addChild(n, c, s);
          }
          i = a.closeIndex + 1;
        } else if (e.substr(i + 1, 3) === "!--") {
          const a = V(e, "-->", i + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const c = e.substring(i + 4, a - 2);
            r = this.saveTextToParentTag(r, n, s), n.add(this.options.commentPropName, [{ [this.options.textNodeName]: c }]);
          }
          i = a;
        } else if (e.substr(i + 1, 2) === "!D") {
          const a = ar(e, i);
          this.docTypeEntities = a.entities, i = a.i;
        } else if (e.substr(i + 1, 2) === "![") {
          const a = V(e, "]]>", i, "CDATA is not closed.") - 2, c = e.substring(i + 9, a);
          r = this.saveTextToParentTag(r, n, s);
          let f = this.parseTextData(c, n.tagname, s, !0, !1, !0, !0);
          f == null && (f = ""), this.options.cdataPropName ? n.add(this.options.cdataPropName, [{ [this.options.textNodeName]: c }]) : n.add(this.options.textNodeName, f), i = a + 2;
        } else {
          let a = Fe(e, i, this.options.removeNSPrefix), c = a.tagName;
          const f = a.rawTagName;
          let u = a.tagExp, p = a.attrExpPresent, g = a.closeIndex;
          this.options.transformTagName && (c = this.options.transformTagName(c)), n && r && n.tagname !== "!xml" && (r = this.saveTextToParentTag(r, n, s, !1));
          const y = n;
          if (y && this.options.unpairedTags.indexOf(y.tagname) !== -1 && (n = this.tagsNodeStack.pop(), s = s.substring(0, s.lastIndexOf("."))), c !== t.tagname && (s += s ? "." + c : c), this.isItStopNode(this.options.stopNodes, s, c)) {
            let d = "";
            if (u.length > 0 && u.lastIndexOf("/") === u.length - 1)
              c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), s = s.substr(0, s.length - 1), u = c) : u = u.substr(0, u.length - 1), i = a.closeIndex;
            else if (this.options.unpairedTags.indexOf(c) !== -1)
              i = a.closeIndex;
            else {
              const h = this.readStopNodeData(e, f, g + 1);
              if (!h) throw new Error(`Unexpected end of ${f}`);
              i = h.i, d = h.tagContent;
            }
            const m = new D(c);
            c !== u && p && (m[":@"] = this.buildAttributesMap(u, s, c)), d && (d = this.parseTextData(d, c, s, !0, p, !0, !0)), s = s.substr(0, s.lastIndexOf(".")), m.add(this.options.textNodeName, d), this.addChild(n, m, s);
          } else {
            if (u.length > 0 && u.lastIndexOf("/") === u.length - 1) {
              c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), s = s.substr(0, s.length - 1), u = c) : u = u.substr(0, u.length - 1), this.options.transformTagName && (c = this.options.transformTagName(c));
              const d = new D(c);
              c !== u && p && (d[":@"] = this.buildAttributesMap(u, s, c)), this.addChild(n, d, s), s = s.substr(0, s.lastIndexOf("."));
            } else {
              const d = new D(c);
              this.tagsNodeStack.push(n), c !== u && p && (d[":@"] = this.buildAttributesMap(u, s, c)), this.addChild(n, d, s), n = d;
            }
            r = "", i = g;
          }
        }
      else
        r += e[i];
    return t.child;
  };
  function br(e, t, n) {
    const r = this.options.updateTag(t.tagname, n, t[":@"]);
    r === !1 || (typeof r == "string" && (t.tagname = r), e.addChild(t));
  }
  const yr = function(e) {
    if (this.options.processEntities) {
      for (let t in this.docTypeEntities) {
        const n = this.docTypeEntities[t];
        e = e.replace(n.regx, n.val);
      }
      for (let t in this.lastEntities) {
        const n = this.lastEntities[t];
        e = e.replace(n.regex, n.val);
      }
      if (this.options.htmlEntities)
        for (let t in this.htmlEntities) {
          const n = this.htmlEntities[t];
          e = e.replace(n.regex, n.val);
        }
      e = e.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return e;
  };
  function Er(e, t, n, r) {
    return e && (r === void 0 && (r = t.child.length === 0), e = this.parseTextData(
      e,
      t.tagname,
      n,
      !1,
      t[":@"] ? Object.keys(t[":@"]).length !== 0 : !1,
      r
    ), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), e = ""), e;
  }
  function wr(e, t, n) {
    const r = "*." + n;
    for (const s in e) {
      const i = e[s];
      if (r === i || t === i) return !0;
    }
    return !1;
  }
  function Nr(e, t, n = ">") {
    let r, s = "";
    for (let i = t; i < e.length; i++) {
      let o = e[i];
      if (r)
        o === r && (r = "");
      else if (o === '"' || o === "'")
        r = o;
      else if (o === n[0])
        if (n[1]) {
          if (e[i + 1] === n[1])
            return {
              data: s,
              index: i
            };
        } else
          return {
            data: s,
            index: i
          };
      else o === "	" && (o = " ");
      s += o;
    }
  }
  function V(e, t, n, r) {
    const s = e.indexOf(t, n);
    if (s === -1)
      throw new Error(r);
    return s + t.length - 1;
  }
  function Fe(e, t, n, r = ">") {
    const s = Nr(e, t + 1, r);
    if (!s) return;
    let i = s.data;
    const o = s.index, a = i.search(/\s/);
    let c = i, f = !0;
    a !== -1 && (c = i.substring(0, a), i = i.substring(a + 1).trimStart());
    const u = c;
    if (n) {
      const p = c.indexOf(":");
      p !== -1 && (c = c.substr(p + 1), f = c !== s.data.substr(p + 1));
    }
    return {
      tagName: c,
      tagExp: i,
      closeIndex: o,
      attrExpPresent: f,
      rawTagName: u
    };
  }
  function Sr(e, t, n) {
    const r = n;
    let s = 1;
    for (; n < e.length; n++)
      if (e[n] === "<")
        if (e[n + 1] === "/") {
          const i = V(e, ">", n, `${t} is not closed`);
          if (e.substring(n + 2, i).trim() === t && (s--, s === 0))
            return {
              tagContent: e.substring(r, n),
              i
            };
          n = i;
        } else if (e[n + 1] === "?")
          n = V(e, "?>", n + 1, "StopNode is not closed.");
        else if (e.substr(n + 1, 3) === "!--")
          n = V(e, "-->", n + 3, "StopNode is not closed.");
        else if (e.substr(n + 1, 2) === "![")
          n = V(e, "]]>", n, "StopNode is not closed.") - 2;
        else {
          const i = Fe(e, n, ">");
          i && ((i && i.tagName) === t && i.tagExp[i.tagExp.length - 1] !== "/" && s++, n = i.closeIndex);
        }
  }
  function Le(e, t, n) {
    if (t && typeof e == "string") {
      const r = e.trim();
      return r === "true" ? !0 : r === "false" ? !1 : cr(e, n);
    } else
      return Pt.isExist(e) ? e : "";
  }
  var Tr = lr, xt = {};
  function Rr(e, t) {
    return It(e, t);
  }
  function It(e, t, n) {
    let r;
    const s = {};
    for (let i = 0; i < e.length; i++) {
      const o = e[i], a = Or(o);
      let c = "";
      if (n === void 0 ? c = a : c = n + "." + a, a === t.textNodeName)
        r === void 0 ? r = o[a] : r += "" + o[a];
      else {
        if (a === void 0)
          continue;
        if (o[a]) {
          let f = It(o[a], t, c);
          const u = Cr(f, t);
          o[":@"] ? Ar(f, o[":@"], c, t) : Object.keys(f).length === 1 && f[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? f = f[t.textNodeName] : Object.keys(f).length === 0 && (t.alwaysCreateTextNode ? f[t.textNodeName] = "" : f = ""), s[a] !== void 0 && s.hasOwnProperty(a) ? (Array.isArray(s[a]) || (s[a] = [s[a]]), s[a].push(f)) : t.isArray(a, c, u) ? s[a] = [f] : s[a] = f;
        }
      }
    }
    return typeof r == "string" ? r.length > 0 && (s[t.textNodeName] = r) : r !== void 0 && (s[t.textNodeName] = r), s;
  }
  function Or(e) {
    const t = Object.keys(e);
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      if (r !== ":@") return r;
    }
  }
  function Ar(e, t, n, r) {
    if (t) {
      const s = Object.keys(t), i = s.length;
      for (let o = 0; o < i; o++) {
        const a = s[o];
        r.isArray(a, n + "." + a, !0, !0) ? e[a] = [t[a]] : e[a] = t[a];
      }
    }
  }
  function Cr(e, t) {
    const { textNodeName: n } = t, r = Object.keys(e).length;
    return !!(r === 0 || r === 1 && (e[n] || typeof e[n] == "boolean" || e[n] === 0));
  }
  xt.prettify = Rr;
  const { buildOptions: Pr } = ke, xr = Tr, { prettify: Ir } = xt, _r = $e;
  let Fr = class {
    constructor(t) {
      this.externalEntities = {}, this.options = Pr(t);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(t, n) {
      if (typeof t != "string") if (t.toString)
        t = t.toString();
      else
        throw new Error("XML data is accepted in String or Bytes[] form.");
      if (n) {
        n === !0 && (n = {});
        const i = _r.validate(t, n);
        if (i !== !0)
          throw Error(`${i.err.msg}:${i.err.line}:${i.err.col}`);
      }
      const r = new xr(this.options);
      r.addExternalEntities(this.externalEntities);
      const s = r.parseXml(t);
      return this.options.preserveOrder || s === void 0 ? s : Ir(s, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(t, n) {
      if (n.indexOf("&") !== -1)
        throw new Error("Entity value can't have '&'");
      if (t.indexOf("&") !== -1 || t.indexOf(";") !== -1)
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      if (n === "&")
        throw new Error("An entity with value '&' is not permitted");
      this.externalEntities[t] = n;
    }
  };
  var Lr = Fr;
  const Br = `
`;
  function Ur(e, t) {
    let n = "";
    return t.format && t.indentBy.length > 0 && (n = Br), _t(e, t, "", n);
  }
  function _t(e, t, n, r) {
    let s = "", i = !1;
    for (let o = 0; o < e.length; o++) {
      const a = e[o], c = Mr(a);
      if (c === void 0) continue;
      let f = "";
      if (n.length === 0 ? f = c : f = `${n}.${c}`, c === t.textNodeName) {
        let d = a[c];
        vr(f, t) || (d = t.tagValueProcessor(c, d), d = Ft(d, t)), i && (s += r), s += d, i = !1;
        continue;
      } else if (c === t.cdataPropName) {
        i && (s += r), s += `<![CDATA[${a[c][0][t.textNodeName]}]]>`, i = !1;
        continue;
      } else if (c === t.commentPropName) {
        s += r + `<!--${a[c][0][t.textNodeName]}-->`, i = !0;
        continue;
      } else if (c[0] === "?") {
        const d = nt(a[":@"], t), m = c === "?xml" ? "" : r;
        let h = a[c][0][t.textNodeName];
        h = h.length !== 0 ? " " + h : "", s += m + `<${c}${h}${d}?>`, i = !0;
        continue;
      }
      let u = r;
      u !== "" && (u += t.indentBy);
      const p = nt(a[":@"], t), g = r + `<${c}${p}`, y = _t(a[c], t, f, u);
      t.unpairedTags.indexOf(c) !== -1 ? t.suppressUnpairedNode ? s += g + ">" : s += g + "/>" : (!y || y.length === 0) && t.suppressEmptyNode ? s += g + "/>" : y && y.endsWith(">") ? s += g + `>${y}${r}</${c}>` : (s += g + ">", y && r !== "" && (y.includes("/>") || y.includes("</")) ? s += r + t.indentBy + y + r : s += y, s += `</${c}>`), i = !0;
    }
    return s;
  }
  function Mr(e) {
    const t = Object.keys(e);
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      if (e.hasOwnProperty(r) && r !== ":@")
        return r;
    }
  }
  function nt(e, t) {
    let n = "";
    if (e && !t.ignoreAttributes)
      for (let r in e) {
        if (!e.hasOwnProperty(r)) continue;
        let s = t.attributeValueProcessor(r, e[r]);
        s = Ft(s, t), s === !0 && t.suppressBooleanAttributes ? n += ` ${r.substr(t.attributeNamePrefix.length)}` : n += ` ${r.substr(t.attributeNamePrefix.length)}="${s}"`;
      }
    return n;
  }
  function vr(e, t) {
    e = e.substr(0, e.length - t.textNodeName.length - 1);
    let n = e.substr(e.lastIndexOf(".") + 1);
    for (let r in t.stopNodes)
      if (t.stopNodes[r] === e || t.stopNodes[r] === "*." + n) return !0;
    return !1;
  }
  function Ft(e, t) {
    if (e && e.length > 0 && t.processEntities)
      for (let n = 0; n < t.entities.length; n++) {
        const r = t.entities[n];
        e = e.replace(r.regex, r.val);
      }
    return e;
  }
  var $r = Ur;
  const Hr = $r, kr = Ct, jr = {
    attributeNamePrefix: "@_",
    attributesGroupName: !1,
    textNodeName: "#text",
    ignoreAttributes: !0,
    cdataPropName: !1,
    format: !1,
    indentBy: "  ",
    suppressEmptyNode: !1,
    suppressUnpairedNode: !0,
    suppressBooleanAttributes: !0,
    tagValueProcessor: function(e, t) {
      return t;
    },
    attributeValueProcessor: function(e, t) {
      return t;
    },
    preserveOrder: !1,
    commentPropName: !1,
    unpairedTags: [],
    entities: [
      { regex: new RegExp("&", "g"), val: "&amp;" },
      //it must be on top
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: !0,
    stopNodes: [],
    // transformTagName: false,
    // transformAttributeName: false,
    oneListGroup: !1
  };
  function H(e) {
    this.options = Object.assign({}, jr, e), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
      return !1;
    } : (this.ignoreAttributesFn = kr(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = Xr), this.processTextOrObjNode = Vr, this.options.format ? (this.indentate = qr, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
      return "";
    }, this.tagEndChar = ">", this.newLine = "");
  }
  H.prototype.build = function(e) {
    return this.options.preserveOrder ? Hr(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = {
      [this.options.arrayNodeName]: e
    }), this.j2x(e, 0, []).val);
  };
  H.prototype.j2x = function(e, t, n) {
    let r = "", s = "";
    const i = n.join(".");
    for (let o in e)
      if (Object.prototype.hasOwnProperty.call(e, o))
        if (typeof e[o] > "u")
          this.isAttribute(o) && (s += "");
        else if (e[o] === null)
          this.isAttribute(o) || o === this.options.cdataPropName ? s += "" : o[0] === "?" ? s += this.indentate(t) + "<" + o + "?" + this.tagEndChar : s += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
        else if (e[o] instanceof Date)
          s += this.buildTextValNode(e[o], o, "", t);
        else if (typeof e[o] != "object") {
          const a = this.isAttribute(o);
          if (a && !this.ignoreAttributesFn(a, i))
            r += this.buildAttrPairStr(a, "" + e[o]);
          else if (!a)
            if (o === this.options.textNodeName) {
              let c = this.options.tagValueProcessor(o, "" + e[o]);
              s += this.replaceEntitiesValue(c);
            } else
              s += this.buildTextValNode(e[o], o, "", t);
        } else if (Array.isArray(e[o])) {
          const a = e[o].length;
          let c = "", f = "";
          for (let u = 0; u < a; u++) {
            const p = e[o][u];
            if (!(typeof p > "u")) if (p === null)
              o[0] === "?" ? s += this.indentate(t) + "<" + o + "?" + this.tagEndChar : s += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
            else if (typeof p == "object")
              if (this.options.oneListGroup) {
                const g = this.j2x(p, t + 1, n.concat(o));
                c += g.val, this.options.attributesGroupName && p.hasOwnProperty(this.options.attributesGroupName) && (f += g.attrStr);
              } else
                c += this.processTextOrObjNode(p, o, t, n);
            else if (this.options.oneListGroup) {
              let g = this.options.tagValueProcessor(o, p);
              g = this.replaceEntitiesValue(g), c += g;
            } else
              c += this.buildTextValNode(p, o, "", t);
          }
          this.options.oneListGroup && (c = this.buildObjectNode(c, o, f, t)), s += c;
        } else if (this.options.attributesGroupName && o === this.options.attributesGroupName) {
          const a = Object.keys(e[o]), c = a.length;
          for (let f = 0; f < c; f++)
            r += this.buildAttrPairStr(a[f], "" + e[o][a[f]]);
        } else
          s += this.processTextOrObjNode(e[o], o, t, n);
    return { attrStr: r, val: s };
  };
  H.prototype.buildAttrPairStr = function(e, t) {
    return t = this.options.attributeValueProcessor(e, "" + t), t = this.replaceEntitiesValue(t), this.options.suppressBooleanAttributes && t === "true" ? " " + e : " " + e + '="' + t + '"';
  };
  function Vr(e, t, n, r) {
    const s = this.j2x(e, n + 1, r.concat(t));
    return e[this.options.textNodeName] !== void 0 && Object.keys(e).length === 1 ? this.buildTextValNode(e[this.options.textNodeName], t, s.attrStr, n) : this.buildObjectNode(s.val, t, s.attrStr, n);
  }
  H.prototype.buildObjectNode = function(e, t, n, r) {
    if (e === "")
      return t[0] === "?" ? this.indentate(r) + "<" + t + n + "?" + this.tagEndChar : this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar;
    {
      let s = "</" + t + this.tagEndChar, i = "";
      return t[0] === "?" && (i = "?", s = ""), (n || n === "") && e.indexOf("<") === -1 ? this.indentate(r) + "<" + t + n + i + ">" + e + s : this.options.commentPropName !== !1 && t === this.options.commentPropName && i.length === 0 ? this.indentate(r) + `<!--${e}-->` + this.newLine : this.indentate(r) + "<" + t + n + i + this.tagEndChar + e + this.indentate(r) + s;
    }
  };
  H.prototype.closeTag = function(e) {
    let t = "";
    return this.options.unpairedTags.indexOf(e) !== -1 ? this.options.suppressUnpairedNode || (t = "/") : this.options.suppressEmptyNode ? t = "/" : t = `></${e}`, t;
  };
  H.prototype.buildTextValNode = function(e, t, n, r) {
    if (this.options.cdataPropName !== !1 && t === this.options.cdataPropName)
      return this.indentate(r) + `<![CDATA[${e}]]>` + this.newLine;
    if (this.options.commentPropName !== !1 && t === this.options.commentPropName)
      return this.indentate(r) + `<!--${e}-->` + this.newLine;
    if (t[0] === "?")
      return this.indentate(r) + "<" + t + n + "?" + this.tagEndChar;
    {
      let s = this.options.tagValueProcessor(t, e);
      return s = this.replaceEntitiesValue(s), s === "" ? this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar : this.indentate(r) + "<" + t + n + ">" + s + "</" + t + this.tagEndChar;
    }
  };
  H.prototype.replaceEntitiesValue = function(e) {
    if (e && e.length > 0 && this.options.processEntities)
      for (let t = 0; t < this.options.entities.length; t++) {
        const n = this.options.entities[t];
        e = e.replace(n.regex, n.val);
      }
    return e;
  };
  function qr(e) {
    return this.options.indentBy.repeat(e);
  }
  function Xr(e) {
    return e.startsWith(this.options.attributeNamePrefix) && e !== this.options.textNodeName ? e.substr(this.attrPrefixLen) : !1;
  }
  var Wr = H;
  const Jr = $e, zr = Lr, Gr = Wr;
  var Lt = {
    XMLParser: zr,
    XMLValidator: Jr,
    XMLBuilder: Gr
  }, Bt = {
    attributeNamePrefix: "_",
    attrNodeName: "",
    //default is false
    textNodeName: "#text",
    ignoreAttributes: !1,
    cdataTagName: "__cdata",
    //default is false
    cdataPositionChar: "\\c",
    format: !1,
    indentBy: "  ",
    supressEmptyNode: !1
  };
  const Kr = new Lt.XMLParser(Bt), Yr = new Lt.XMLBuilder(Bt);
  function Ut(e) {
    return Yr.build(e);
  }
  function Mt(e) {
    return Kr.parse(e);
  }
  Ne.exports = {
    json2xml: Ut,
    xml2json: Mt
  };
  const vt = (e) => e, $t = (e) => {
    let t = {
      "pwg:Height": 3507,
      "pwg:Width": 2481,
      "pwg:XOffset": 0,
      "pwg:YOffset": 0
      // "_pwg:MustHonor": true
    };
    for (let n = 0; n < M.length; n++)
      if (M[n].label === e) {
        t["pwg:Height"] = M[n].Height, t["pwg:Width"] = M[n].Width, t["pwg:XOffset"] = M[n].XOffset, t["pwg:YOffset"] = M[n].YOffset;
        break;
      }
    return {
      [E.ScanRegion]: t
    };
  }, Ht = (e) => e === "ADF" ? "Feeder" : "Platen", kt = (e) => e === "application/pdf" ? "Document" : "Photo", rt = (e) => {
    let t = {};
    for (let n in e)
      switch (n) {
        case "HttpHeaders":
          t[E.HttpHeaders] = {}, t[E.HttpHeaders][E.HttpHeader] = e[n];
          continue;
        case "RetryInfo":
          t[E.RetryInfo] = {
            [E.NumberOfRetries]: e.RetryInfo.NumberOfRetries,
            [E.RetryInterval]: e.RetryInfo.RetryInterval,
            [E.RetryTimeOut]: e.RetryInfo.RetryTimeOut
          };
          continue;
        default:
          t[E[n]] = e[n];
      }
    return t;
  }, Zr = (e) => {
    let t = {};
    if (e && Array.isArray(e)) {
      t[E.HttpDestination] = [];
      for (let n = 0; n < e.length; n++)
        t[E.HttpDestination].push(rt(e[n]));
    } else
      t[E.HttpDestination] = rt(e);
    return t;
  }, jt = (e) => {
    let t = {
      "_xmlns:scan": Nt,
      "_xmlns:pwg": St,
      "_xmlns:dest": Tt
    }, n;
    for (n in e)
      switch (n) {
        case "DocumentFormat":
          t[E.Intent] = kt(e.DocumentFormat), e.Version < 2.1 ? t[E.DocumentFormat] = e[n] : t[E.DocumentFormatExt] = e[n];
          continue;
        case "InputSource":
          t[E[n]] = Ht(e[n]);
          continue;
        case "ScanRegions":
          t[E.ScanRegions] = $t(e[n]);
          continue;
        case "ScanDestinations":
          t[E.ScanDestinations] = Zr(e[n]);
          continue;
        case "Resolution":
          continue;
        default:
          t[E[n]] = e[n];
      }
    let r = vt(e.Resolution);
    return t[E.XResolution] = r, t[E.YResolution] = r, { "scan:ScanSettings": t };
  };
  function Vt(e) {
    let t = jt(e);
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + Ut(t);
  }
  Ne.exports = {
    getSettingResolution: vt,
    getSettingPaperSize: $t,
    getSettingInputSource: Ht,
    getSettingIntent: kt,
    getScanSettingObj: jt,
    getScanSetting: Vt
  };
  function qt(e, t) {
    return function() {
      return e.apply(t, arguments);
    };
  }
  const { toString: Qr } = Object.prototype, { getPrototypeOf: je } = Object, { iterator: ge, toStringTag: Xt } = Symbol, me = /* @__PURE__ */ ((e) => (t) => {
    const n = Qr.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null)), L = (e) => (e = e.toLowerCase(), (t) => me(t) === e), be = (e) => (t) => typeof t === e, { isArray: K } = Array, G = be("undefined");
  function te(e) {
    return e !== null && !G(e) && e.constructor !== null && !G(e.constructor) && C(e.constructor.isBuffer) && e.constructor.isBuffer(e);
  }
  const Wt = L("ArrayBuffer");
  function Dr(e) {
    let t;
    return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Wt(e.buffer), t;
  }
  const es = be("string"), C = be("function"), Jt = be("number"), ne = (e) => e !== null && typeof e == "object", ts = (e) => e === !0 || e === !1, le = (e) => {
    if (me(e) !== "object")
      return !1;
    const t = je(e);
    return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Xt in e) && !(ge in e);
  }, ns = (e) => {
    if (!ne(e) || te(e))
      return !1;
    try {
      return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
    } catch {
      return !1;
    }
  }, rs = L("Date"), ss = L("File"), is = L("Blob"), os = L("FileList"), as = (e) => ne(e) && C(e.pipe), cs = (e) => {
    let t;
    return e && (typeof FormData == "function" && e instanceof FormData || C(e.append) && ((t = me(e)) === "formdata" || // detect form-data instance
    t === "object" && C(e.toString) && e.toString() === "[object FormData]"));
  }, us = L("URLSearchParams"), [ls, fs, ds, ps] = ["ReadableStream", "Request", "Response", "Headers"].map(L), hs = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function re(e, t, { allOwnKeys: n = !1 } = {}) {
    if (e === null || typeof e > "u")
      return;
    let r, s;
    if (typeof e != "object" && (e = [e]), K(e))
      for (r = 0, s = e.length; r < s; r++)
        t.call(null, e[r], r, e);
    else {
      if (te(e))
        return;
      const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), o = i.length;
      let a;
      for (r = 0; r < o; r++)
        a = i[r], t.call(null, e[a], a, e);
    }
  }
  function zt(e, t) {
    if (te(e))
      return null;
    t = t.toLowerCase();
    const n = Object.keys(e);
    let r = n.length, s;
    for (; r-- > 0; )
      if (s = n[r], t === s.toLowerCase())
        return s;
    return null;
  }
  const q = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Gt = (e) => !G(e) && e !== q;
  function Be() {
    const { caseless: e, skipUndefined: t } = Gt(this) && this || {}, n = {}, r = (s, i) => {
      const o = e && zt(n, i) || i;
      le(n[o]) && le(s) ? n[o] = Be(n[o], s) : le(s) ? n[o] = Be({}, s) : K(s) ? n[o] = s.slice() : (!t || !G(s)) && (n[o] = s);
    };
    for (let s = 0, i = arguments.length; s < i; s++)
      arguments[s] && re(arguments[s], r);
    return n;
  }
  const gs = (e, t, n, { allOwnKeys: r } = {}) => (re(t, (s, i) => {
    n && C(s) ? e[i] = qt(s, n) : e[i] = s;
  }, { allOwnKeys: r }), e), ms = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), bs = (e, t, n, r) => {
    e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
      value: t.prototype
    }), n && Object.assign(e.prototype, n);
  }, ys = (e, t, n, r) => {
    let s, i, o;
    const a = {};
    if (t = t || {}, e == null) return t;
    do {
      for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
        o = s[i], (!r || r(o, e, t)) && !a[o] && (t[o] = e[o], a[o] = !0);
      e = n !== !1 && je(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  }, Es = (e, t, n) => {
    e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
    const r = e.indexOf(t, n);
    return r !== -1 && r === n;
  }, ws = (e) => {
    if (!e) return null;
    if (K(e)) return e;
    let t = e.length;
    if (!Jt(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; )
      n[t] = e[t];
    return n;
  }, Ns = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && je(Uint8Array)), Ss = (e, t) => {
    const r = (e && e[ge]).call(e);
    let s;
    for (; (s = r.next()) && !s.done; ) {
      const i = s.value;
      t.call(e, i[0], i[1]);
    }
  }, Ts = (e, t) => {
    let n;
    const r = [];
    for (; (n = e.exec(t)) !== null; )
      r.push(n);
    return r;
  }, Rs = L("HTMLFormElement"), Os = (e) => e.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function(n, r, s) {
      return r.toUpperCase() + s;
    }
  ), st = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), As = L("RegExp"), Kt = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e), r = {};
    re(n, (s, i) => {
      let o;
      (o = t(s, i, e)) !== !1 && (r[i] = o || s);
    }), Object.defineProperties(e, r);
  }, Cs = (e) => {
    Kt(e, (t, n) => {
      if (C(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
        return !1;
      const r = e[n];
      if (C(r)) {
        if (t.enumerable = !1, "writable" in t) {
          t.writable = !1;
          return;
        }
        t.set || (t.set = () => {
          throw Error("Can not rewrite read-only method '" + n + "'");
        });
      }
    });
  }, Ps = (e, t) => {
    const n = {}, r = (s) => {
      s.forEach((i) => {
        n[i] = !0;
      });
    };
    return K(e) ? r(e) : r(String(e).split(t)), n;
  }, xs = () => {
  }, Is = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
  function _s(e) {
    return !!(e && C(e.append) && e[Xt] === "FormData" && e[ge]);
  }
  const Fs = (e) => {
    const t = new Array(10), n = (r, s) => {
      if (ne(r)) {
        if (t.indexOf(r) >= 0)
          return;
        if (te(r))
          return r;
        if (!("toJSON" in r)) {
          t[s] = r;
          const i = K(r) ? [] : {};
          return re(r, (o, a) => {
            const c = n(o, s + 1);
            !G(c) && (i[a] = c);
          }), t[s] = void 0, i;
        }
      }
      return r;
    };
    return n(e, 0);
  }, Ls = L("AsyncFunction"), Bs = (e) => e && (ne(e) || C(e)) && C(e.then) && C(e.catch), Yt = ((e, t) => e ? setImmediate : t ? ((n, r) => (q.addEventListener("message", ({ source: s, data: i }) => {
    s === q && i === n && r.length && r.shift()();
  }, !1), (s) => {
    r.push(s), q.postMessage(n, "*");
  }))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
    typeof setImmediate == "function",
    C(q.postMessage)
  ), Us = typeof queueMicrotask < "u" ? queueMicrotask.bind(q) : typeof process < "u" && process.nextTick || Yt, Ms = (e) => e != null && C(e[ge]), l = {
    isArray: K,
    isArrayBuffer: Wt,
    isBuffer: te,
    isFormData: cs,
    isArrayBufferView: Dr,
    isString: es,
    isNumber: Jt,
    isBoolean: ts,
    isObject: ne,
    isPlainObject: le,
    isEmptyObject: ns,
    isReadableStream: ls,
    isRequest: fs,
    isResponse: ds,
    isHeaders: ps,
    isUndefined: G,
    isDate: rs,
    isFile: ss,
    isBlob: is,
    isRegExp: As,
    isFunction: C,
    isStream: as,
    isURLSearchParams: us,
    isTypedArray: Ns,
    isFileList: os,
    forEach: re,
    merge: Be,
    extend: gs,
    trim: hs,
    stripBOM: ms,
    inherits: bs,
    toFlatObject: ys,
    kindOf: me,
    kindOfTest: L,
    endsWith: Es,
    toArray: ws,
    forEachEntry: Ss,
    matchAll: Ts,
    isHTMLForm: Rs,
    hasOwnProperty: st,
    hasOwnProp: st,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors: Kt,
    freezeMethods: Cs,
    toObjectSet: Ps,
    toCamelCase: Os,
    noop: xs,
    toFiniteNumber: Is,
    findKey: zt,
    global: q,
    isContextDefined: Gt,
    isSpecCompliantForm: _s,
    toJSONObject: Fs,
    isAsyncFn: Ls,
    isThenable: Bs,
    setImmediate: Yt,
    asap: Us,
    isIterable: Ms
  };
  function b(e, t, n, r, s) {
    Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
  }
  l.inherits(b, Error, {
    toJSON: function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: l.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const Zt = b.prototype, Qt = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((e) => {
    Qt[e] = { value: e };
  });
  Object.defineProperties(b, Qt);
  Object.defineProperty(Zt, "isAxiosError", { value: !0 });
  b.from = (e, t, n, r, s, i) => {
    const o = Object.create(Zt);
    l.toFlatObject(e, o, function(u) {
      return u !== Error.prototype;
    }, (f) => f !== "isAxiosError");
    const a = e && e.message ? e.message : "Error", c = t == null && e ? e.code : t;
    return b.call(o, a, c, n, r, s), e && o.cause == null && Object.defineProperty(o, "cause", { value: e, configurable: !0 }), o.name = e && e.name || "Error", i && Object.assign(o, i), o;
  };
  const vs = null;
  function Ue(e) {
    return l.isPlainObject(e) || l.isArray(e);
  }
  function Dt(e) {
    return l.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function it(e, t, n) {
    return e ? e.concat(t).map(function(s, i) {
      return s = Dt(s), !n && i ? "[" + s + "]" : s;
    }).join(n ? "." : "") : t;
  }
  function $s(e) {
    return l.isArray(e) && !e.some(Ue);
  }
  const Hs = l.toFlatObject(l, {}, null, function(t) {
    return /^is[A-Z]/.test(t);
  });
  function ye(e, t, n) {
    if (!l.isObject(e))
      throw new TypeError("target must be an object");
    t = t || new FormData(), n = l.toFlatObject(n, {
      metaTokens: !0,
      dots: !1,
      indexes: !1
    }, !1, function(m, h) {
      return !l.isUndefined(h[m]);
    });
    const r = n.metaTokens, s = n.visitor || u, i = n.dots, o = n.indexes, c = (n.Blob || typeof Blob < "u" && Blob) && l.isSpecCompliantForm(t);
    if (!l.isFunction(s))
      throw new TypeError("visitor must be a function");
    function f(d) {
      if (d === null) return "";
      if (l.isDate(d))
        return d.toISOString();
      if (l.isBoolean(d))
        return d.toString();
      if (!c && l.isBlob(d))
        throw new b("Blob is not supported. Use a Buffer instead.");
      return l.isArrayBuffer(d) || l.isTypedArray(d) ? c && typeof Blob == "function" ? new Blob([d]) : Buffer.from(d) : d;
    }
    function u(d, m, h) {
      let S = d;
      if (d && !h && typeof d == "object") {
        if (l.endsWith(m, "{}"))
          m = r ? m : m.slice(0, -2), d = JSON.stringify(d);
        else if (l.isArray(d) && $s(d) || (l.isFileList(d) || l.endsWith(m, "[]")) && (S = l.toArray(d)))
          return m = Dt(m), S.forEach(function(T, A) {
            !(l.isUndefined(T) || T === null) && t.append(
              // eslint-disable-next-line no-nested-ternary
              o === !0 ? it([m], A, i) : o === null ? m : m + "[]",
              f(T)
            );
          }), !1;
      }
      return Ue(d) ? !0 : (t.append(it(h, m, i), f(d)), !1);
    }
    const p = [], g = Object.assign(Hs, {
      defaultVisitor: u,
      convertValue: f,
      isVisitable: Ue
    });
    function y(d, m) {
      if (!l.isUndefined(d)) {
        if (p.indexOf(d) !== -1)
          throw Error("Circular reference detected in " + m.join("."));
        p.push(d), l.forEach(d, function(S, x) {
          (!(l.isUndefined(S) || S === null) && s.call(
            t,
            S,
            l.isString(x) ? x.trim() : x,
            m,
            g
          )) === !0 && y(S, m ? m.concat(x) : [x]);
        }), p.pop();
      }
    }
    if (!l.isObject(e))
      throw new TypeError("data must be an object");
    return y(e), t;
  }
  function ot(e) {
    const t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(r) {
      return t[r];
    });
  }
  function Ve(e, t) {
    this._pairs = [], e && ye(e, this, t);
  }
  const en = Ve.prototype;
  en.append = function(t, n) {
    this._pairs.push([t, n]);
  };
  en.toString = function(t) {
    const n = t ? function(r) {
      return t.call(this, r, ot);
    } : ot;
    return this._pairs.map(function(s) {
      return n(s[0]) + "=" + n(s[1]);
    }, "").join("&");
  };
  function ks(e) {
    return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function tn(e, t, n) {
    if (!t)
      return e;
    const r = n && n.encode || ks;
    l.isFunction(n) && (n = {
      serialize: n
    });
    const s = n && n.serialize;
    let i;
    if (s ? i = s(t, n) : i = l.isURLSearchParams(t) ? t.toString() : new Ve(t, n).toString(r), i) {
      const o = e.indexOf("#");
      o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
    }
    return e;
  }
  class at {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(t, n, r) {
      return this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null
      }), this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */
    eject(t) {
      this.handlers[t] && (this.handlers[t] = null);
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      this.handlers && (this.handlers = []);
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(t) {
      l.forEach(this.handlers, function(r) {
        r !== null && t(r);
      });
    }
  }
  const nn = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1
  }, js = typeof URLSearchParams < "u" ? URLSearchParams : Ve, Vs = typeof FormData < "u" ? FormData : null, qs = typeof Blob < "u" ? Blob : null, Xs = {
    isBrowser: !0,
    classes: {
      URLSearchParams: js,
      FormData: Vs,
      Blob: qs
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  }, qe = typeof window < "u" && typeof document < "u", Me = typeof navigator == "object" && navigator || void 0, Ws = qe && (!Me || ["ReactNative", "NativeScript", "NS"].indexOf(Me.product) < 0), Js = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts == "function", zs = qe && window.location.href || "http://localhost", Gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv: qe,
    hasStandardBrowserEnv: Ws,
    hasStandardBrowserWebWorkerEnv: Js,
    navigator: Me,
    origin: zs
  }, Symbol.toStringTag, { value: "Module" })), R = {
    ...Gs,
    ...Xs
  };
  function Ks(e, t) {
    return ye(e, new R.classes.URLSearchParams(), {
      visitor: function(n, r, s, i) {
        return R.isNode && l.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
      },
      ...t
    });
  }
  function Ys(e) {
    return l.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
  }
  function Zs(e) {
    const t = {}, n = Object.keys(e);
    let r;
    const s = n.length;
    let i;
    for (r = 0; r < s; r++)
      i = n[r], t[i] = e[i];
    return t;
  }
  function rn(e) {
    function t(n, r, s, i) {
      let o = n[i++];
      if (o === "__proto__") return !0;
      const a = Number.isFinite(+o), c = i >= n.length;
      return o = !o && l.isArray(s) ? s.length : o, c ? (l.hasOwnProp(s, o) ? s[o] = [s[o], r] : s[o] = r, !a) : ((!s[o] || !l.isObject(s[o])) && (s[o] = []), t(n, r, s[o], i) && l.isArray(s[o]) && (s[o] = Zs(s[o])), !a);
    }
    if (l.isFormData(e) && l.isFunction(e.entries)) {
      const n = {};
      return l.forEachEntry(e, (r, s) => {
        t(Ys(r), s, n, 0);
      }), n;
    }
    return null;
  }
  function Qs(e, t, n) {
    if (l.isString(e))
      try {
        return (t || JSON.parse)(e), l.trim(e);
      } catch (r) {
        if (r.name !== "SyntaxError")
          throw r;
      }
    return (n || JSON.stringify)(e);
  }
  const se = {
    transitional: nn,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function(t, n) {
      const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, i = l.isObject(t);
      if (i && l.isHTMLForm(t) && (t = new FormData(t)), l.isFormData(t))
        return s ? JSON.stringify(rn(t)) : t;
      if (l.isArrayBuffer(t) || l.isBuffer(t) || l.isStream(t) || l.isFile(t) || l.isBlob(t) || l.isReadableStream(t))
        return t;
      if (l.isArrayBufferView(t))
        return t.buffer;
      if (l.isURLSearchParams(t))
        return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
      let a;
      if (i) {
        if (r.indexOf("application/x-www-form-urlencoded") > -1)
          return Ks(t, this.formSerializer).toString();
        if ((a = l.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
          const c = this.env && this.env.FormData;
          return ye(
            a ? { "files[]": t } : t,
            c && new c(),
            this.formSerializer
          );
        }
      }
      return i || s ? (n.setContentType("application/json", !1), Qs(t)) : t;
    }],
    transformResponse: [function(t) {
      const n = this.transitional || se.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
      if (l.isResponse(t) || l.isReadableStream(t))
        return t;
      if (t && l.isString(t) && (r && !this.responseType || s)) {
        const o = !(n && n.silentJSONParsing) && s;
        try {
          return JSON.parse(t, this.parseReviver);
        } catch (a) {
          if (o)
            throw a.name === "SyntaxError" ? b.from(a, b.ERR_BAD_RESPONSE, this, null, this.response) : a;
        }
      }
      return t;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: R.classes.FormData,
      Blob: R.classes.Blob
    },
    validateStatus: function(t) {
      return t >= 200 && t < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  l.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
    se.headers[e] = {};
  });
  const Ds = l.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]), ei = (e) => {
    const t = {};
    let n, r, s;
    return e && e.split(`
`).forEach(function(o) {
      s = o.indexOf(":"), n = o.substring(0, s).trim().toLowerCase(), r = o.substring(s + 1).trim(), !(!n || t[n] && Ds[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
    }), t;
  }, ct = Symbol("internals");
  function ee(e) {
    return e && String(e).trim().toLowerCase();
  }
  function fe(e) {
    return e === !1 || e == null ? e : l.isArray(e) ? e.map(fe) : String(e);
  }
  function ti(e) {
    const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let r;
    for (; r = n.exec(e); )
      t[r[1]] = r[2];
    return t;
  }
  const ni = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
  function Pe(e, t, n, r, s) {
    if (l.isFunction(r))
      return r.call(this, t, n);
    if (s && (t = n), !!l.isString(t)) {
      if (l.isString(r))
        return t.indexOf(r) !== -1;
      if (l.isRegExp(r))
        return r.test(t);
    }
  }
  function ri(e) {
    return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
  }
  function si(e, t) {
    const n = l.toCamelCase(" " + t);
    ["get", "set", "has"].forEach((r) => {
      Object.defineProperty(e, r + n, {
        value: function(s, i, o) {
          return this[r].call(this, t, s, i, o);
        },
        configurable: !0
      });
    });
  }
  let P = class {
    constructor(t) {
      t && this.set(t);
    }
    set(t, n, r) {
      const s = this;
      function i(a, c, f) {
        const u = ee(c);
        if (!u)
          throw new Error("header name must be a non-empty string");
        const p = l.findKey(s, u);
        (!p || s[p] === void 0 || f === !0 || f === void 0 && s[p] !== !1) && (s[p || c] = fe(a));
      }
      const o = (a, c) => l.forEach(a, (f, u) => i(f, u, c));
      if (l.isPlainObject(t) || t instanceof this.constructor)
        o(t, n);
      else if (l.isString(t) && (t = t.trim()) && !ni(t))
        o(ei(t), n);
      else if (l.isObject(t) && l.isIterable(t)) {
        let a = {}, c, f;
        for (const u of t) {
          if (!l.isArray(u))
            throw TypeError("Object iterator must return a key-value pair");
          a[f = u[0]] = (c = a[f]) ? l.isArray(c) ? [...c, u[1]] : [c, u[1]] : u[1];
        }
        o(a, n);
      } else
        t != null && i(n, t, r);
      return this;
    }
    get(t, n) {
      if (t = ee(t), t) {
        const r = l.findKey(this, t);
        if (r) {
          const s = this[r];
          if (!n)
            return s;
          if (n === !0)
            return ti(s);
          if (l.isFunction(n))
            return n.call(this, s, r);
          if (l.isRegExp(n))
            return n.exec(s);
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(t, n) {
      if (t = ee(t), t) {
        const r = l.findKey(this, t);
        return !!(r && this[r] !== void 0 && (!n || Pe(this, this[r], r, n)));
      }
      return !1;
    }
    delete(t, n) {
      const r = this;
      let s = !1;
      function i(o) {
        if (o = ee(o), o) {
          const a = l.findKey(r, o);
          a && (!n || Pe(r, r[a], a, n)) && (delete r[a], s = !0);
        }
      }
      return l.isArray(t) ? t.forEach(i) : i(t), s;
    }
    clear(t) {
      const n = Object.keys(this);
      let r = n.length, s = !1;
      for (; r--; ) {
        const i = n[r];
        (!t || Pe(this, this[i], i, t, !0)) && (delete this[i], s = !0);
      }
      return s;
    }
    normalize(t) {
      const n = this, r = {};
      return l.forEach(this, (s, i) => {
        const o = l.findKey(r, i);
        if (o) {
          n[o] = fe(s), delete n[i];
          return;
        }
        const a = t ? ri(i) : String(i).trim();
        a !== i && delete n[i], n[a] = fe(s), r[a] = !0;
      }), this;
    }
    concat(...t) {
      return this.constructor.concat(this, ...t);
    }
    toJSON(t) {
      const n = /* @__PURE__ */ Object.create(null);
      return l.forEach(this, (r, s) => {
        r != null && r !== !1 && (n[s] = t && l.isArray(r) ? r.join(", ") : r);
      }), n;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(t) {
      return t instanceof this ? t : new this(t);
    }
    static concat(t, ...n) {
      const r = new this(t);
      return n.forEach((s) => r.set(s)), r;
    }
    static accessor(t) {
      const r = (this[ct] = this[ct] = {
        accessors: {}
      }).accessors, s = this.prototype;
      function i(o) {
        const a = ee(o);
        r[a] || (si(s, o), r[a] = !0);
      }
      return l.isArray(t) ? t.forEach(i) : i(t), this;
    }
  };
  P.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  l.reduceDescriptors(P.prototype, ({ value: e }, t) => {
    let n = t[0].toUpperCase() + t.slice(1);
    return {
      get: () => e,
      set(r) {
        this[n] = r;
      }
    };
  });
  l.freezeMethods(P);
  function xe(e, t) {
    const n = this || se, r = t || n, s = P.from(r.headers);
    let i = r.data;
    return l.forEach(e, function(a) {
      i = a.call(n, i, s.normalize(), t ? t.status : void 0);
    }), s.normalize(), i;
  }
  function sn(e) {
    return !!(e && e.__CANCEL__);
  }
  function Y(e, t, n) {
    b.call(this, e ?? "canceled", b.ERR_CANCELED, t, n), this.name = "CanceledError";
  }
  l.inherits(Y, b, {
    __CANCEL__: !0
  });
  function on(e, t, n) {
    const r = n.config.validateStatus;
    !n.status || !r || r(n.status) ? e(n) : t(new b(
      "Request failed with status code " + n.status,
      [b.ERR_BAD_REQUEST, b.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
      n.config,
      n.request,
      n
    ));
  }
  function ii(e) {
    const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return t && t[1] || "";
  }
  function oi(e, t) {
    e = e || 10;
    const n = new Array(e), r = new Array(e);
    let s = 0, i = 0, o;
    return t = t !== void 0 ? t : 1e3, function(c) {
      const f = Date.now(), u = r[i];
      o || (o = f), n[s] = c, r[s] = f;
      let p = i, g = 0;
      for (; p !== s; )
        g += n[p++], p = p % e;
      if (s = (s + 1) % e, s === i && (i = (i + 1) % e), f - o < t)
        return;
      const y = u && f - u;
      return y ? Math.round(g * 1e3 / y) : void 0;
    };
  }
  function ai(e, t) {
    let n = 0, r = 1e3 / t, s, i;
    const o = (f, u = Date.now()) => {
      n = u, s = null, i && (clearTimeout(i), i = null), e(...f);
    };
    return [(...f) => {
      const u = Date.now(), p = u - n;
      p >= r ? o(f, u) : (s = f, i || (i = setTimeout(() => {
        i = null, o(s);
      }, r - p)));
    }, () => s && o(s)];
  }
  const pe = (e, t, n = 3) => {
    let r = 0;
    const s = oi(50, 250);
    return ai((i) => {
      const o = i.loaded, a = i.lengthComputable ? i.total : void 0, c = o - r, f = s(c), u = o <= a;
      r = o;
      const p = {
        loaded: o,
        total: a,
        progress: a ? o / a : void 0,
        bytes: c,
        rate: f || void 0,
        estimated: f && a && u ? (a - o) / f : void 0,
        event: i,
        lengthComputable: a != null,
        [t ? "download" : "upload"]: !0
      };
      e(p);
    }, n);
  }, ut = (e, t) => {
    const n = e != null;
    return [(r) => t[0]({
      lengthComputable: n,
      total: e,
      loaded: r
    }), t[1]];
  }, lt = (e) => (...t) => l.asap(() => e(...t)), ci = R.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, R.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
    new URL(R.origin),
    R.navigator && /(msie|trident)/i.test(R.navigator.userAgent)
  ) : () => !0, ui = R.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(e, t, n, r, s, i, o) {
        if (typeof document > "u") return;
        const a = [`${e}=${encodeURIComponent(t)}`];
        l.isNumber(n) && a.push(`expires=${new Date(n).toUTCString()}`), l.isString(r) && a.push(`path=${r}`), l.isString(s) && a.push(`domain=${s}`), i === !0 && a.push("secure"), l.isString(o) && a.push(`SameSite=${o}`), document.cookie = a.join("; ");
      },
      read(e) {
        if (typeof document > "u") return null;
        const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
        return t ? decodeURIComponent(t[1]) : null;
      },
      remove(e) {
        this.write(e, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function li(e) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
  }
  function fi(e, t) {
    return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
  }
  function an(e, t, n) {
    let r = !li(t);
    return e && (r || n == !1) ? fi(e, t) : t;
  }
  const ft = (e) => e instanceof P ? { ...e } : e;
  function W(e, t) {
    t = t || {};
    const n = {};
    function r(f, u, p, g) {
      return l.isPlainObject(f) && l.isPlainObject(u) ? l.merge.call({ caseless: g }, f, u) : l.isPlainObject(u) ? l.merge({}, u) : l.isArray(u) ? u.slice() : u;
    }
    function s(f, u, p, g) {
      if (l.isUndefined(u)) {
        if (!l.isUndefined(f))
          return r(void 0, f, p, g);
      } else return r(f, u, p, g);
    }
    function i(f, u) {
      if (!l.isUndefined(u))
        return r(void 0, u);
    }
    function o(f, u) {
      if (l.isUndefined(u)) {
        if (!l.isUndefined(f))
          return r(void 0, f);
      } else return r(void 0, u);
    }
    function a(f, u, p) {
      if (p in t)
        return r(f, u);
      if (p in e)
        return r(void 0, f);
    }
    const c = {
      url: i,
      method: i,
      data: i,
      baseURL: o,
      transformRequest: o,
      transformResponse: o,
      paramsSerializer: o,
      timeout: o,
      timeoutMessage: o,
      withCredentials: o,
      withXSRFToken: o,
      adapter: o,
      responseType: o,
      xsrfCookieName: o,
      xsrfHeaderName: o,
      onUploadProgress: o,
      onDownloadProgress: o,
      decompress: o,
      maxContentLength: o,
      maxBodyLength: o,
      beforeRedirect: o,
      transport: o,
      httpAgent: o,
      httpsAgent: o,
      cancelToken: o,
      socketPath: o,
      responseEncoding: o,
      validateStatus: a,
      headers: (f, u, p) => s(ft(f), ft(u), p, !0)
    };
    return l.forEach(Object.keys({ ...e, ...t }), function(u) {
      const p = c[u] || s, g = p(e[u], t[u], u);
      l.isUndefined(g) && p !== a || (n[u] = g);
    }), n;
  }
  const cn = (e) => {
    const t = W({}, e);
    let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: i, headers: o, auth: a } = t;
    if (t.headers = o = P.from(o), t.url = tn(an(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), a && o.set(
      "Authorization",
      "Basic " + btoa((a.username || "") + ":" + (a.password ? unescape(encodeURIComponent(a.password)) : ""))
    ), l.isFormData(n)) {
      if (R.hasStandardBrowserEnv || R.hasStandardBrowserWebWorkerEnv)
        o.setContentType(void 0);
      else if (l.isFunction(n.getHeaders)) {
        const c = n.getHeaders(), f = ["content-type", "content-length"];
        Object.entries(c).forEach(([u, p]) => {
          f.includes(u.toLowerCase()) && o.set(u, p);
        });
      }
    }
    if (R.hasStandardBrowserEnv && (r && l.isFunction(r) && (r = r(t)), r || r !== !1 && ci(t.url))) {
      const c = s && i && ui.read(i);
      c && o.set(s, c);
    }
    return t;
  }, di = typeof XMLHttpRequest < "u", pi = di && function(e) {
    return new Promise(function(n, r) {
      const s = cn(e);
      let i = s.data;
      const o = P.from(s.headers).normalize();
      let { responseType: a, onUploadProgress: c, onDownloadProgress: f } = s, u, p, g, y, d;
      function m() {
        y && y(), d && d(), s.cancelToken && s.cancelToken.unsubscribe(u), s.signal && s.signal.removeEventListener("abort", u);
      }
      let h = new XMLHttpRequest();
      h.open(s.method.toUpperCase(), s.url, !0), h.timeout = s.timeout;
      function S() {
        if (!h)
          return;
        const T = P.from(
          "getAllResponseHeaders" in h && h.getAllResponseHeaders()
        ), F = {
          data: !a || a === "text" || a === "json" ? h.responseText : h.response,
          status: h.status,
          statusText: h.statusText,
          headers: T,
          config: e,
          request: h
        };
        on(function(I) {
          n(I), m();
        }, function(I) {
          r(I), m();
        }, F), h = null;
      }
      "onloadend" in h ? h.onloadend = S : h.onreadystatechange = function() {
        !h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.indexOf("file:") === 0) || setTimeout(S);
      }, h.onabort = function() {
        h && (r(new b("Request aborted", b.ECONNABORTED, e, h)), h = null);
      }, h.onerror = function(A) {
        const F = A && A.message ? A.message : "Network Error", k = new b(F, b.ERR_NETWORK, e, h);
        k.event = A || null, r(k), h = null;
      }, h.ontimeout = function() {
        let A = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
        const F = s.transitional || nn;
        s.timeoutErrorMessage && (A = s.timeoutErrorMessage), r(new b(
          A,
          F.clarifyTimeoutError ? b.ETIMEDOUT : b.ECONNABORTED,
          e,
          h
        )), h = null;
      }, i === void 0 && o.setContentType(null), "setRequestHeader" in h && l.forEach(o.toJSON(), function(A, F) {
        h.setRequestHeader(F, A);
      }), l.isUndefined(s.withCredentials) || (h.withCredentials = !!s.withCredentials), a && a !== "json" && (h.responseType = s.responseType), f && ([g, d] = pe(f, !0), h.addEventListener("progress", g)), c && h.upload && ([p, y] = pe(c), h.upload.addEventListener("progress", p), h.upload.addEventListener("loadend", y)), (s.cancelToken || s.signal) && (u = (T) => {
        h && (r(!T || T.type ? new Y(null, e, h) : T), h.abort(), h = null);
      }, s.cancelToken && s.cancelToken.subscribe(u), s.signal && (s.signal.aborted ? u() : s.signal.addEventListener("abort", u)));
      const x = ii(s.url);
      if (x && R.protocols.indexOf(x) === -1) {
        r(new b("Unsupported protocol " + x + ":", b.ERR_BAD_REQUEST, e));
        return;
      }
      h.send(i || null);
    });
  }, hi = (e, t) => {
    const { length: n } = e = e ? e.filter(Boolean) : [];
    if (t || n) {
      let r = new AbortController(), s;
      const i = function(f) {
        if (!s) {
          s = !0, a();
          const u = f instanceof Error ? f : this.reason;
          r.abort(u instanceof b ? u : new Y(u instanceof Error ? u.message : u));
        }
      };
      let o = t && setTimeout(() => {
        o = null, i(new b(`timeout ${t} of ms exceeded`, b.ETIMEDOUT));
      }, t);
      const a = () => {
        e && (o && clearTimeout(o), o = null, e.forEach((f) => {
          f.unsubscribe ? f.unsubscribe(i) : f.removeEventListener("abort", i);
        }), e = null);
      };
      e.forEach((f) => f.addEventListener("abort", i));
      const { signal: c } = r;
      return c.unsubscribe = () => l.asap(a), c;
    }
  }, gi = function* (e, t) {
    let n = e.byteLength;
    if (n < t) {
      yield e;
      return;
    }
    let r = 0, s;
    for (; r < n; )
      s = r + t, yield e.slice(r, s), r = s;
  }, mi = async function* (e, t) {
    for await (const n of bi(e))
      yield* gi(n, t);
  }, bi = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (; ; ) {
        const { done: n, value: r } = await t.read();
        if (n)
          break;
        yield r;
      }
    } finally {
      await t.cancel();
    }
  }, dt = (e, t, n, r) => {
    const s = mi(e, t);
    let i = 0, o, a = (c) => {
      o || (o = !0, r && r(c));
    };
    return new ReadableStream({
      async pull(c) {
        try {
          const { done: f, value: u } = await s.next();
          if (f) {
            a(), c.close();
            return;
          }
          let p = u.byteLength;
          if (n) {
            let g = i += p;
            n(g);
          }
          c.enqueue(new Uint8Array(u));
        } catch (f) {
          throw a(f), f;
        }
      },
      cancel(c) {
        return a(c), s.return();
      }
    }, {
      highWaterMark: 2
    });
  }, pt = 64 * 1024, { isFunction: ce } = l, yi = (({ Request: e, Response: t }) => ({
    Request: e,
    Response: t
  }))(l.global), {
    ReadableStream: ht,
    TextEncoder: gt
  } = l.global, mt = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  }, Ei = (e) => {
    e = l.merge.call({
      skipUndefined: !0
    }, yi, e);
    const { fetch: t, Request: n, Response: r } = e, s = t ? ce(t) : typeof fetch == "function", i = ce(n), o = ce(r);
    if (!s)
      return !1;
    const a = s && ce(ht), c = s && (typeof gt == "function" ? /* @__PURE__ */ ((d) => (m) => d.encode(m))(new gt()) : async (d) => new Uint8Array(await new n(d).arrayBuffer())), f = i && a && mt(() => {
      let d = !1;
      const m = new n(R.origin, {
        body: new ht(),
        method: "POST",
        get duplex() {
          return d = !0, "half";
        }
      }).headers.has("Content-Type");
      return d && !m;
    }), u = o && a && mt(() => l.isReadableStream(new r("").body)), p = {
      stream: u && ((d) => d.body)
    };
    s && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((d) => {
      !p[d] && (p[d] = (m, h) => {
        let S = m && m[d];
        if (S)
          return S.call(m);
        throw new b(`Response type '${d}' is not supported`, b.ERR_NOT_SUPPORT, h);
      });
    });
    const g = async (d) => {
      if (d == null)
        return 0;
      if (l.isBlob(d))
        return d.size;
      if (l.isSpecCompliantForm(d))
        return (await new n(R.origin, {
          method: "POST",
          body: d
        }).arrayBuffer()).byteLength;
      if (l.isArrayBufferView(d) || l.isArrayBuffer(d))
        return d.byteLength;
      if (l.isURLSearchParams(d) && (d = d + ""), l.isString(d))
        return (await c(d)).byteLength;
    }, y = async (d, m) => {
      const h = l.toFiniteNumber(d.getContentLength());
      return h ?? g(m);
    };
    return async (d) => {
      let {
        url: m,
        method: h,
        data: S,
        signal: x,
        cancelToken: T,
        timeout: A,
        onDownloadProgress: F,
        onUploadProgress: k,
        responseType: I,
        headers: Se,
        withCredentials: ie = "same-origin",
        fetchOptions: We
      } = cn(d), Je = t || fetch;
      I = I ? (I + "").toLowerCase() : "text";
      let oe = hi([x, T && T.toAbortSignal()], A), Z = null;
      const j = oe && oe.unsubscribe && (() => {
        oe.unsubscribe();
      });
      let ze;
      try {
        if (k && f && h !== "get" && h !== "head" && (ze = await y(Se, S)) !== 0) {
          let $ = new n(m, {
            method: "POST",
            body: S,
            duplex: "half"
          }), J;
          if (l.isFormData(S) && (J = $.headers.get("content-type")) && Se.setContentType(J), $.body) {
            const [Te, ae] = ut(
              ze,
              pe(lt(k))
            );
            S = dt($.body, pt, Te, ae);
          }
        }
        l.isString(ie) || (ie = ie ? "include" : "omit");
        const B = i && "credentials" in n.prototype, Ge = {
          ...We,
          signal: oe,
          method: h.toUpperCase(),
          headers: Se.normalize().toJSON(),
          body: S,
          duplex: "half",
          credentials: B ? ie : void 0
        };
        Z = i && new n(m, Ge);
        let v = await (i ? Je(Z, We) : Je(m, Ge));
        const Ke = u && (I === "stream" || I === "response");
        if (u && (F || Ke && j)) {
          const $ = {};
          ["status", "statusText", "headers"].forEach((Ye) => {
            $[Ye] = v[Ye];
          });
          const J = l.toFiniteNumber(v.headers.get("content-length")), [Te, ae] = F && ut(
            J,
            pe(lt(F), !0)
          ) || [];
          v = new r(
            dt(v.body, pt, Te, () => {
              ae && ae(), j && j();
            }),
            $
          );
        }
        I = I || "text";
        let hn = await p[l.findKey(p, I) || "text"](v, d);
        return !Ke && j && j(), await new Promise(($, J) => {
          on($, J, {
            data: hn,
            headers: P.from(v.headers),
            status: v.status,
            statusText: v.statusText,
            config: d,
            request: Z
          });
        });
      } catch (B) {
        throw j && j(), B && B.name === "TypeError" && /Load failed|fetch/i.test(B.message) ? Object.assign(
          new b("Network Error", b.ERR_NETWORK, d, Z),
          {
            cause: B.cause || B
          }
        ) : b.from(B, B && B.code, d, Z);
      }
    };
  }, wi = /* @__PURE__ */ new Map(), un = (e) => {
    let t = e && e.env || {};
    const { fetch: n, Request: r, Response: s } = t, i = [
      r,
      s,
      n
    ];
    let o = i.length, a = o, c, f, u = wi;
    for (; a--; )
      c = i[a], f = u.get(c), f === void 0 && u.set(c, f = a ? /* @__PURE__ */ new Map() : Ei(t)), u = f;
    return f;
  };
  un();
  const Xe = {
    http: vs,
    xhr: pi,
    fetch: {
      get: un
    }
  };
  l.forEach(Xe, (e, t) => {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch {
      }
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  const bt = (e) => `- ${e}`, Ni = (e) => l.isFunction(e) || e === null || e === !1;
  function Si(e, t) {
    e = l.isArray(e) ? e : [e];
    const { length: n } = e;
    let r, s;
    const i = {};
    for (let o = 0; o < n; o++) {
      r = e[o];
      let a;
      if (s = r, !Ni(r) && (s = Xe[(a = String(r)).toLowerCase()], s === void 0))
        throw new b(`Unknown adapter '${a}'`);
      if (s && (l.isFunction(s) || (s = s.get(t))))
        break;
      i[a || "#" + o] = s;
    }
    if (!s) {
      const o = Object.entries(i).map(
        ([c, f]) => `adapter ${c} ` + (f === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let a = n ? o.length > 1 ? `since :
` + o.map(bt).join(`
`) : " " + bt(o[0]) : "as no adapter specified";
      throw new b(
        "There is no suitable adapter to dispatch the request " + a,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  }
  const ln = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter: Si,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: Xe
  };
  function Ie(e) {
    if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
      throw new Y(null, e);
  }
  function yt(e) {
    return Ie(e), e.headers = P.from(e.headers), e.data = xe.call(
      e,
      e.transformRequest
    ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), ln.getAdapter(e.adapter || se.adapter, e)(e).then(function(r) {
      return Ie(e), r.data = xe.call(
        e,
        e.transformResponse,
        r
      ), r.headers = P.from(r.headers), r;
    }, function(r) {
      return sn(r) || (Ie(e), r && r.response && (r.response.data = xe.call(
        e,
        e.transformResponse,
        r.response
      ), r.response.headers = P.from(r.response.headers))), Promise.reject(r);
    });
  }
  const fn = "1.13.2", Ee = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
    Ee[e] = function(r) {
      return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
    };
  });
  const Et = {};
  Ee.transitional = function(t, n, r) {
    function s(i, o) {
      return "[Axios v" + fn + "] Transitional option '" + i + "'" + o + (r ? ". " + r : "");
    }
    return (i, o, a) => {
      if (t === !1)
        throw new b(
          s(o, " has been removed" + (n ? " in " + n : "")),
          b.ERR_DEPRECATED
        );
      return n && !Et[o] && (Et[o] = !0, console.warn(
        s(
          o,
          " has been deprecated since v" + n + " and will be removed in the near future"
        )
      )), t ? t(i, o, a) : !0;
    };
  };
  Ee.spelling = function(t) {
    return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
  };
  function Ti(e, t, n) {
    if (typeof e != "object")
      throw new b("options must be an object", b.ERR_BAD_OPTION_VALUE);
    const r = Object.keys(e);
    let s = r.length;
    for (; s-- > 0; ) {
      const i = r[s], o = t[i];
      if (o) {
        const a = e[i], c = a === void 0 || o(a, i, e);
        if (c !== !0)
          throw new b("option " + i + " must be " + c, b.ERR_BAD_OPTION_VALUE);
        continue;
      }
      if (n !== !0)
        throw new b("Unknown option " + i, b.ERR_BAD_OPTION);
    }
  }
  const de = {
    assertOptions: Ti,
    validators: Ee
  }, U = de.validators;
  let X = class {
    constructor(t) {
      this.defaults = t || {}, this.interceptors = {
        request: new at(),
        response: new at()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(t, n) {
      try {
        return await this._request(t, n);
      } catch (r) {
        if (r instanceof Error) {
          let s = {};
          Error.captureStackTrace ? Error.captureStackTrace(s) : s = new Error();
          const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
          try {
            r.stack ? i && !String(r.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + i) : r.stack = i;
          } catch {
          }
        }
        throw r;
      }
    }
    _request(t, n) {
      typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = W(this.defaults, n);
      const { transitional: r, paramsSerializer: s, headers: i } = n;
      r !== void 0 && de.assertOptions(r, {
        silentJSONParsing: U.transitional(U.boolean),
        forcedJSONParsing: U.transitional(U.boolean),
        clarifyTimeoutError: U.transitional(U.boolean)
      }, !1), s != null && (l.isFunction(s) ? n.paramsSerializer = {
        serialize: s
      } : de.assertOptions(s, {
        encode: U.function,
        serialize: U.function
      }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), de.assertOptions(n, {
        baseUrl: U.spelling("baseURL"),
        withXsrfToken: U.spelling("withXSRFToken")
      }, !0), n.method = (n.method || this.defaults.method || "get").toLowerCase();
      let o = i && l.merge(
        i.common,
        i[n.method]
      );
      i && l.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (d) => {
          delete i[d];
        }
      ), n.headers = P.concat(o, i);
      const a = [];
      let c = !0;
      this.interceptors.request.forEach(function(m) {
        typeof m.runWhen == "function" && m.runWhen(n) === !1 || (c = c && m.synchronous, a.unshift(m.fulfilled, m.rejected));
      });
      const f = [];
      this.interceptors.response.forEach(function(m) {
        f.push(m.fulfilled, m.rejected);
      });
      let u, p = 0, g;
      if (!c) {
        const d = [yt.bind(this), void 0];
        for (d.unshift(...a), d.push(...f), g = d.length, u = Promise.resolve(n); p < g; )
          u = u.then(d[p++], d[p++]);
        return u;
      }
      g = a.length;
      let y = n;
      for (; p < g; ) {
        const d = a[p++], m = a[p++];
        try {
          y = d(y);
        } catch (h) {
          m.call(this, h);
          break;
        }
      }
      try {
        u = yt.call(this, y);
      } catch (d) {
        return Promise.reject(d);
      }
      for (p = 0, g = f.length; p < g; )
        u = u.then(f[p++], f[p++]);
      return u;
    }
    getUri(t) {
      t = W(this.defaults, t);
      const n = an(t.baseURL, t.url, t.allowAbsoluteUrls);
      return tn(n, t.params, t.paramsSerializer);
    }
  };
  l.forEach(["delete", "get", "head", "options"], function(t) {
    X.prototype[t] = function(n, r) {
      return this.request(W(r || {}, {
        method: t,
        url: n,
        data: (r || {}).data
      }));
    };
  });
  l.forEach(["post", "put", "patch"], function(t) {
    function n(r) {
      return function(i, o, a) {
        return this.request(W(a || {}, {
          method: t,
          headers: r ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: i,
          data: o
        }));
      };
    }
    X.prototype[t] = n(), X.prototype[t + "Form"] = n(!0);
  });
  let Ri = class dn {
    constructor(t) {
      if (typeof t != "function")
        throw new TypeError("executor must be a function.");
      let n;
      this.promise = new Promise(function(i) {
        n = i;
      });
      const r = this;
      this.promise.then((s) => {
        if (!r._listeners) return;
        let i = r._listeners.length;
        for (; i-- > 0; )
          r._listeners[i](s);
        r._listeners = null;
      }), this.promise.then = (s) => {
        let i;
        const o = new Promise((a) => {
          r.subscribe(a), i = a;
        }).then(s);
        return o.cancel = function() {
          r.unsubscribe(i);
        }, o;
      }, t(function(i, o, a) {
        r.reason || (r.reason = new Y(i, o, a), n(r.reason));
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason)
        throw this.reason;
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(t) {
      if (this.reason) {
        t(this.reason);
        return;
      }
      this._listeners ? this._listeners.push(t) : this._listeners = [t];
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(t) {
      if (!this._listeners)
        return;
      const n = this._listeners.indexOf(t);
      n !== -1 && this._listeners.splice(n, 1);
    }
    toAbortSignal() {
      const t = new AbortController(), n = (r) => {
        t.abort(r);
      };
      return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let t;
      return {
        token: new dn(function(s) {
          t = s;
        }),
        cancel: t
      };
    }
  };
  function Oi(e) {
    return function(n) {
      return e.apply(null, n);
    };
  }
  function Ai(e) {
    return l.isObject(e) && e.isAxiosError === !0;
  }
  const ve = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(ve).forEach(([e, t]) => {
    ve[t] = e;
  });
  function pn(e) {
    const t = new X(e), n = qt(X.prototype.request, t);
    return l.extend(n, X.prototype, t, { allOwnKeys: !0 }), l.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
      return pn(W(e, s));
    }, n;
  }
  const N = pn(se);
  N.Axios = X;
  N.CanceledError = Y;
  N.CancelToken = Ri;
  N.isCancel = sn;
  N.VERSION = fn;
  N.toFormData = ye;
  N.AxiosError = b;
  N.Cancel = N.CanceledError;
  N.all = function(t) {
    return Promise.all(t);
  };
  N.spread = Oi;
  N.isAxiosError = Ai;
  N.mergeConfig = W;
  N.AxiosHeaders = P;
  N.formToJSON = (e) => rn(l.isHTMLForm(e) ? new FormData(e) : e);
  N.getAdapter = ln.getAdapter;
  N.HttpStatusCode = ve;
  N.default = N;
  const {
    Axios: Ui,
    AxiosError: Mi,
    CanceledError: vi,
    isCancel: $i,
    CancelToken: Hi,
    VERSION: ki,
    all: ji,
    Cancel: Vi,
    isAxiosError: qi,
    spread: Xi,
    toFormData: Wi,
    AxiosHeaders: Ji,
    HttpStatusCode: zi,
    formToJSON: Gi,
    getAdapter: Ki,
    mergeConfig: Yi
  } = N;
  let we;
  we = N.create();
  we.interceptors.request.use(
    function(e) {
      return e;
    },
    function(e) {
      return Promise.reject(e);
    }
  );
  we.interceptors.response.use(
    (e) => {
      let t = e.headers["content-type"] || e.headers["Content-Type"];
      if (t.indexOf("text/xml") > -1 || t.indexOf("application/xml") > -1) {
        let n = e.data.toString();
        return Mt(n);
      }
      return e;
    },
    function(e) {
      return Promise.reject(e);
    }
  );
  const Ci = we;
  class Pi {
    constructor(t) {
      z(this, "ip");
      z(this, "version", 2.1);
      z(this, "rs", "eSCL");
      z(this, "prototype", "http://");
      z(this, "port", 8080);
      this.ip = t.ip, this.port = t.port || 8080, this.version = t.version || 2, this.rs = t.rs || "eSCL";
    }
    execute(t, n) {
      let r = { url: "" };
      return n && (r = { ...n }), r.url = `${this.prototype}${this.ip}:${this.port}/${this.rs}/${t}`, Ci(r);
    }
    async ScannerCapabilities() {
      let t = {
        method: "GET"
      };
      try {
        let n = await this.execute("ScannerCapabilities", t);
        return {
          capabilities: n,
          scansetting: xn(n),
          BrightnessSupport: In(n)
        };
      } catch (n) {
        throw n;
      }
    }
    async ScanJobs(t) {
      let n = {
        method: "POST",
        data: Vt({ ...t, Version: this.version })
      };
      return (await this.execute("ScanJobs", n)).headers.location;
    }
    async ScannerStatus() {
      try {
        return (await this.execute("ScannerStatus"))["scan:ScannerStatus"];
      } catch (t) {
        throw t;
      }
    }
    NextDocument(t) {
      return this.execute(`ScanJobs/${t}/NextDocument`, { responseType: "arraybuffer" }).then((n) => n, (n) => n.response && n.response.status === 503 ? new Promise((r) => setTimeout(r, 2e3)).then((r) => this.NextDocument(t)) : Promise.reject(n));
    }
    ScanImageInfo(t) {
      return this.execute(`ScanJobs/${t}/ScanImageInfo`).then((n) => n);
    }
  }
  document.getElementById("scan-button").addEventListener("click", async (e) => {
    console.log("Starting scan attempt");
    const t = "127.0.0.1", n = 9880, r = new Pi({ ip: t, port: n });
    try {
      const a = await r.ScannerCapabilities();
      console.log("scanner capabilities", a);
      const c = await r.ScanJobs({
        // Set scanning options
        Resolution: 300
      });
      console.log("job created", c);
      const f = c.split("/").pop(), u = await r.NextDocument(f);
      console.log("scanned document", u);
      var s = new Blob([u.data], { type: "image/jpeg" }), i = window.URL.createObjectURL(s), o = document.querySelector("#preview");
      o.src = i;
    } catch (a) {
      console.log("scanner err", a.response);
    }
  });
});
export default xi();
