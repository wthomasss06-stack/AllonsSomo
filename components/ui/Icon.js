'use client'
import {
  HouseLine, Buildings, ArrowLeft, ArrowRight, Snowflake, Door,
  Lightning, CalendarBlank, XCircle, ChatCircle, Check, CheckCircle,
  CaretLeft, CaretRight, X, CloudArrowUp, Question, Copy, Cookie,
  Trash, NavigationArrow, Car, PencilSimple, WarningCircle,
  CalendarCheck, CaretDown, FacebookLogo, House, Info, Export,
  ForkKnife, Link, Fire, WashingMachine, Park, MapPin, Lock,
  LockOpen, SignOut, Envelope, MapTrifold, Crosshair, ArrowsOut,
  ArrowSquareOut, CreditCard, User, Images, ShieldCheck, SwimmingPool,
  Globe, Upload, ArrowClockwise, ArrowCounterClockwise, FloppyDisk,
  Clock, MagnifyingGlass, MagnifyingGlassMinus, ShareNetwork, Shield,
  DeviceMobile, Star, Ruler, Headset, Television, Seal, Eye, EyeSlash,
  WhatsappLogo, WifiHigh, Sun, Moon, List, Spinner, Warning,
} from '@phosphor-icons/react'

// Mapping Material Icons → Phosphor
const MAP = {
  add_home:               HouseLine,
  apartment:              Buildings,
  arrow_back:             ArrowLeft,
  arrow_forward:          ArrowRight,
  ac_unit:                Snowflake,
  balcony:                Door,
  bolt:                   Lightning,
  calendar_today:         CalendarBlank,
  cancel:                 XCircle,
  chat:                   ChatCircle,
  check:                  Check,
  check_circle:           CheckCircle,
  chevron_left:           CaretLeft,
  chevron_right:          CaretRight,
  close:                  X,
  cloud_upload:           CloudArrowUp,
  contact_support:        Question,
  content_copy:           Copy,
  cookie:                 Cookie,
  delete:                 Trash,
  directions:             NavigationArrow,
  directions_car:         Car,
  edit:                   PencilSimple,
  error_outline:          WarningCircle,
  event_available:        CalendarCheck,
  expand_more:            CaretDown,
  facebook:               FacebookLogo,
  help_outline:           Question,
  home:                   House,
  info:                   Info,
  ios_share:              Export,
  kitchen:                ForkKnife,
  link:                   Link,
  local_fire_department:  Fire,
  local_laundry_service:  WashingMachine,
  local_parking:          Park,
  location_city:          Buildings,
  location_on:            MapPin,
  lock:                   Lock,
  lock_open:              LockOpen,
  logout:                 SignOut,
  mail:                   Envelope,
  map:                    MapTrifold,
  my_location:            Crosshair,
  open_in_full:           ArrowsOut,
  open_in_new:            ArrowSquareOut,
  payments:               CreditCard,
  person:                 User,
  photo_library:          Images,
  place:                  MapPin,
  policy:                 ShieldCheck,
  pool:                   SwimmingPool,
  public:                 Globe,
  publish:                Upload,
  refresh:                ArrowClockwise,
  restart_alt:            ArrowCounterClockwise,
  save:                   FloppyDisk,
  schedule:               Clock,
  search:                 MagnifyingGlass,
  search_off:             MagnifyingGlassMinus,
  security:               ShieldCheck,
  share:                  ShareNetwork,
  shield:                 Shield,
  smartphone:             DeviceMobile,
  star:                   Star,
  straighten:             Ruler,
  support_agent:          Headset,
  tv:                     Television,
  verified:               Seal,
  visibility:             Eye,
  visibility_off:         EyeSlash,
  whatsapp:               WhatsappLogo,
  wifi:                   WifiHigh,
  light_mode:             Sun,
  dark_mode:              Moon,
  menu:                   List,
  warning:                Warning,
}

/**
 * Drop-in replacement for <span className="material-icons">icon_name</span>
 * Usage: <Icon n="chat" size={20} color="var(--gold)" style={{...}} />
 */
export default function Icon({ n, size = 20, color, style, className, weight = 'regular' }) {
  const Component = MAP[n]
  if (!Component) {
    // Fallback: render nothing but warn in dev
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] Unknown icon: "${n}"`)
    }
    return null
  }
  return (
    <Component
      size={size}
      color={color}
      weight={weight}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      className={className}
    />
  )
}
