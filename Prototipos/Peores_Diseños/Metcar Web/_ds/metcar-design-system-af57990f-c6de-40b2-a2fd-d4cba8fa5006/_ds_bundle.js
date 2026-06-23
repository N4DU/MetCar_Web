/* @ds-bundle: {"format":3,"namespace":"MetcarDesignSystem_af5799","components":[{"name":"CategoryTag","sourcePath":"components/brand/CategoryTag.jsx"},{"name":"HoseStrip","sourcePath":"components/brand/HoseStrip.jsx"},{"name":"SpecBadge","sourcePath":"components/brand/SpecBadge.jsx"},{"name":"StockIndicator","sourcePath":"components/brand/StockIndicator.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"}],"sourceHashes":{"components/brand/CategoryTag.jsx":"f26501f42c4c","components/brand/HoseStrip.jsx":"6797ef1c2007","components/brand/SpecBadge.jsx":"c759a339ea5f","components/brand/StockIndicator.jsx":"1f5021ac917d","components/buttons/Button.jsx":"7a357917903a","components/buttons/IconButton.jsx":"1f5d98eb14b1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MetcarDesignSystem_af5799 = window.MetcarDesignSystem_af5799 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/CategoryTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CategoryTag — solid red Barlow Condensed label for product
 * categories. The blunt counterpart to the black/yellow SpecBadge.
 * tone="muted" gives the "sin stock" dim black variant.
 */
function CategoryTag({
  children,
  tone = 'red',
  style,
  ...rest
}) {
  const tones = {
    red: {
      background: 'var(--mc-red)',
      color: '#fff'
    },
    black: {
      background: 'var(--mc-black)',
      color: 'var(--mc-yellow)'
    },
    muted: {
      background: 'var(--mc-black)',
      color: 'var(--mc-yellow-dim)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-tech)',
      fontWeight: 700,
      fontSize: 'var(--tech-sm)',
      letterSpacing: 'var(--track-tech)',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-lg)',
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { CategoryTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/CategoryTag.jsx", error: String((e && e.message) || e) }); }

// components/brand/HoseStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HoseStrip — THE signature surface. Recreates a real hydraulic
 * hose: dark braided gradient body, a red side-stripe, and yellow
 * Barlow Condensed print running along it. Use as a hero motif,
 * section divider, or decorative band.
 */
function HoseStrip({
  spec = 'METCAR 1/2" SAE 100R2AT 225BAR WP 225 TEST 450',
  ref = 'IMPORTADO POR METCAR URUGUAY · metcar.uy',
  size = 'md',
  style,
  ...rest
}) {
  const heights = {
    sm: 46,
    md: 58,
    lg: 70,
    xl: 82
  };
  const h = heights[size] || 58;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      height: h + 'px',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderLeft: 'var(--hose-stripe) solid var(--mc-red)',
      background: 'var(--hose-bg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '10% 0',
      backgroundImage: 'repeating-linear-gradient(-45deg,transparent 0,transparent 5px,rgba(255,255,255,.022) 5px,rgba(255,255,255,.022) 6px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '4px',
      right: 0,
      top: 0,
      height: '32%',
      background: 'linear-gradient(to bottom,rgba(255,255,255,.055),transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '4px',
      right: 0,
      bottom: 0,
      height: '28%',
      background: 'linear-gradient(to top,rgba(0,0,0,.35),transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-tech)',
      fontWeight: 700,
      fontSize: 'var(--tech-lg)',
      color: 'var(--mc-yellow)',
      letterSpacing: 'var(--track-tech-wide)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, spec), ref && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-tech)',
      fontWeight: 500,
      fontSize: 'var(--tech-xs)',
      color: 'rgba(245,197,24,.3)',
      letterSpacing: 'var(--track-tech)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, ref)));
}
Object.assign(__ds_scope, { HoseStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/HoseStrip.jsx", error: String((e && e.message) || e) }); }

// components/brand/SpecBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SpecBadge — the Hose Code in miniature. Yellow Barlow Condensed
 * text on industrial black, exactly like the print on a real
 * hydraulic hose. Use for technical specs: "1/2" · 225 BAR".
 */
function SpecBadge({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      background: 'var(--mc-black)',
      color: 'var(--mc-yellow)',
      fontFamily: 'var(--font-tech)',
      fontWeight: 700,
      fontSize: 'var(--tech-sm)',
      letterSpacing: 'var(--track-tech)',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SpecBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SpecBadge.jsx", error: String((e && e.message) || e) }); }

// components/brand/StockIndicator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StockIndicator — the live "EN STOCK" badge with a pulsing yellow
 * dot on black, or a dim "SIN STOCK" state. Mirrors the hose-code
 * language used across the brand.
 */
function StockIndicator({
  inStock = true,
  labelIn = 'EN STOCK',
  labelOut = 'SIN STOCK',
  style,
  ...rest
}) {
  if (!inStock) {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-block',
        background: 'var(--mc-black)',
        color: 'var(--mc-yellow-dim)',
        fontFamily: 'var(--font-tech)',
        fontWeight: 700,
        fontSize: 'var(--tech-sm)',
        letterSpacing: 'var(--track-tech)',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 'var(--radius-lg)',
        ...style
      }
    }, rest), labelOut);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'var(--mc-black)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--mc-yellow)',
      flexShrink: 0,
      animation: 'mc-pulse 2s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-tech)',
      fontWeight: 700,
      fontSize: 'var(--tech-sm)',
      color: 'var(--mc-yellow)',
      letterSpacing: 'var(--track-tech)',
      textTransform: 'uppercase'
    }
  }, labelIn));
}
Object.assign(__ds_scope, { StockIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/StockIndicator.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Metcar Button — the industrial CTA.
 * Tight 1px radius, Barlow Condensed bold uppercase label with wide
 * tracking. Variants map to brand roles; never rounds heavily.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  iconRight,
  iconLeft,
  disabled = false,
  style,
  ...rest
}) {
  const Tag = as;
  const sizes = {
    sm: {
      padding: '9px 18px',
      fontSize: '11px'
    },
    md: {
      padding: '13px 26px',
      fontSize: '13px'
    },
    lg: {
      padding: '16px 32px',
      fontSize: '14px'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-tech)',
    fontWeight: 700,
    letterSpacing: 'var(--track-tech)',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-xs)',
    border: '2px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-press)',
    textDecoration: 'none',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--color-brand)',
      borderColor: 'var(--color-brand)',
      color: '#fff'
    },
    // Ghost on a LIGHT surface
    ghost: {
      background: 'transparent',
      borderColor: 'var(--border-on-light-strong)',
      color: 'var(--text-primary)'
    },
    // Ghost on a DARK surface
    ghostDark: {
      background: 'transparent',
      borderColor: 'var(--border-on-dark-strong)',
      color: 'var(--text-on-dark-secondary)'
    },
    // Accent — yellow hairline, hose-code flavored
    accent: {
      background: 'transparent',
      borderColor: 'var(--color-accent)',
      color: 'var(--color-accent)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyles = {
    primary: {
      background: 'var(--color-brand-hover)',
      borderColor: 'var(--color-brand-hover)'
    },
    ghost: {
      borderColor: 'var(--color-brand)',
      color: 'var(--color-brand)'
    },
    ghostDark: {
      borderColor: 'rgba(255,255,255,.45)',
      color: '#fff'
    },
    accent: {
      background: 'var(--color-accent)',
      color: 'var(--mc-black)'
    }
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...(hover && !disabled ? hoverStyles[variant] : {}),
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    disabled: Tag === 'button' ? disabled : undefined
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square, minimal icon affordance for navbars/toolbars.
 * Defaults to the muted-on-dark navbar style; pass tone="light" for
 * light surfaces. Optional count badge (cart).
 */
function IconButton({
  children,
  tone = 'dark',
  badge,
  ariaLabel,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    dark: {
      color: hover ? '#fff' : 'rgba(255,255,255,.55)'
    },
    light: {
      color: hover ? 'var(--text-primary)' : 'var(--text-tertiary)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color var(--transition-fast)',
      ...tones[tone],
      ...style
    }
  }, rest), children, badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: 'var(--color-brand)',
      color: '#fff',
      borderRadius: 'var(--radius-pill)',
      width: '14px',
      height: '14px',
      fontFamily: 'var(--font-tech)',
      fontWeight: 700,
      fontSize: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CategoryTag = __ds_scope.CategoryTag;

__ds_ns.HoseStrip = __ds_scope.HoseStrip;

__ds_ns.SpecBadge = __ds_scope.SpecBadge;

__ds_ns.StockIndicator = __ds_scope.StockIndicator;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

})();
