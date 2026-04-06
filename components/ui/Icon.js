'use client'
import {
  Home, Building, ArrowLeft, ArrowRight, SnowFlake, HomeSimpleDoor,
  Svg3DSelectFace, Calendar, Xmark, ChatBubble, Check, BadgeCheck,
  NavArrowLeft, NavArrowRight, Cancel, CloudUpload, QuestionMark, Copy, HalfCookie,
  Trash, DirectionSign, Car, EditPencil, WarningTriangle,
  CalendarCheck, NavArrowDown, Facebook, InfoCircle, ShareIos,
  Utensils, Link, FireFlame, WashingMachine, Parking, MapPin, Lock,
  LockSlash, LogOut, Mail, Map, Compass, Expand, OpenNewWindow,
  CreditCard, User, MediaImage, HistoricShield, Swimming,
  Globe, Upload, Refresh, RefreshDouble, FloppyDisk,
  Clock, Search, ZoomOut, ShareAndroid, CardShield,
  Phone, StarSolid, Ruler, Headset, Tv, CheckCircle, Eye, EyeClosed,
  Whatsapp, Wifi, SunLight, HalfMoon, List, Redo, WarningCircle,
  PiggyBank, Verified,
} from 'iconoir-react'

// Mapping Material Icons → Iconoir
const MAP = {
  add_home:               Home,
  apartment:              Building,
  arrow_back:             ArrowLeft,
  arrow_forward:          ArrowRight,
  ac_unit:                SnowFlake,
  balcony:                HomeSimpleDoor,
  bolt:                   Svg3DSelectFace,
  calendar_today:         Calendar,
  cancel:                 Xmark,
  chat:                   ChatBubble,
  check:                  Check,
  check_circle:           BadgeCheck,
  chevron_left:           NavArrowLeft,
  chevron_right:          NavArrowRight,
  close:                  Cancel,
  cloud_upload:           CloudUpload,
  contact_support:        QuestionMark,
  content_copy:           Copy,
  cookie:                 HalfCookie,
  delete:                 Trash,
  directions:             DirectionSign,
  directions_car:         Car,
  edit:                   EditPencil,
  error_outline:          WarningTriangle,
  event_available:        CalendarCheck,
  expand_more:            NavArrowDown,
  facebook:               Facebook,
  help_outline:           QuestionMark,
  home:                   Home,
  info:                   InfoCircle,
  ios_share:              ShareIos,
  kitchen:                Utensils,
  link:                   Link,
  local_fire_department:  FireFlame,
  local_laundry_service:  WashingMachine,
  local_parking:          Parking,
  location_city:          Building,
  location_on:            MapPin,
  lock:                   Lock,
  lock_open:              LockSlash,
  logout:                 LogOut,
  mail:                   Mail,
  map:                    Map,
  my_location:            Compass,
  open_in_full:           Expand,
  open_in_new:            OpenNewWindow,
  payments:               CreditCard,
  person:                 User,
  photo_library:          MediaImage,
  place:                  MapPin,
  policy:                 HistoricShield,
  pool:                   Swimming,
  public:                 Globe,
  publish:                Upload,
  refresh:                Refresh,
  restart_alt:            RefreshDouble,
  save:                   FloppyDisk,
  schedule:               Clock,
  search:                 Search,
  search_off:             ZoomOut,
  security:               HistoricShield,
  share:                  ShareAndroid,
  shield:                 CardShield,
  smartphone:             Phone,
  star:                   StarSolid,
  straighten:             Ruler,
  support_agent:          Headset,
  tv:                     Tv,
  verified:               CheckCircle,
  visibility:             Eye,
  visibility_off:         EyeClosed,
  whatsapp:               Whatsapp,
  wifi:                   Wifi,
  light_mode:             SunLight,
  dark_mode:              HalfMoon,
  menu:                   List,
  warning:                WarningCircle,
}

/**
 * Drop-in replacement for <span className="material-icons">icon_name</span>
 * Usage: <Icon n="chat" size={20} color="var(--gold)" style={{...}} />
 */
export default function Icon({ n, size = 20, color, style, className }) {
  const Component = MAP[n]
  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] Unknown icon: "${n}"`)
    }
    return null
  }
  return (
    <Component
      width={size}
      height={size}
      color={color}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      className={className}
      strokeWidth={1.6}
    />
  )
}
