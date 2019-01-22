# Lona accessibility support

Lona provides a set of cross-platform parameters to build accessible components. In cases where these aren't enough, the native views can be manipulated directly via code.

- [Accessibility parameters](#accessibility-parameters)
- [Swift](#swift)
  - [iOS](#ios)
  - [macOS](#macos)
- [JavaScript](#javascript)
  - [Web](#web)
  - [React Native](#react-native)

## Accessibility parameters

Lona supports the following layer parameters to generate accessible UI components. These parameters are modeled after iOS and React Native accessibility support. Some parameters are **static**, some are **dynamic**, and some are both. Static parameters can be given a default value (at compile-time). Dynamic parameters can be assigned via Lona Logic (at runtime).

#### `accessibilityType` (static)

_Supported on iOS & web_

Type: one of `"default"`, `"none"`, `"element"`, `"container"`. Default: `"default"`.

This configures overall the behavior of the layer. This parameter is unique to Lona and doesn't directly translate to any platform. Instead, Lona uses it to set other platform-specific parameters.

- **`default`** - Use the platform default values for the layer. For example, Text layers automatically have their `accessibilityLabel` set to the same value as the text. It's best to use `none`, `element`, or `container` instead to explicitly define the behavior, rather than letting the platform guess.
- **`none`** - The layer is hidden from assistive technologies.
- **`element`** - This layer is focusable by assistive technologies. Lona Studio requires this to be set before it will reveal most of the other parameters (e.g. `AccessibilityLabel`).
- **`container`** - This contains accessible descendant layers. These can be configured by id using the `accessibilityElements` parameter.

#### `accessibilityLabel` (static & dynamic)

_Supported on iOS & web_

Type: `String`

A screenreader reads this text when the user focuses the layer.

#### `accessibilityHint` (static & dynamic)

_Currently supported on iOS_

Type: `String`

A screenreader reads this text after reading the `accessibilityLabel` and other information. This can suggest how the layer should be used, e.g. "double tap to add to cart".

#### `accessibilityValue` (dynamic)

_Currently supported on iOS_

Type: `String`

Use this when working with interactive controls. For example, a number input field would set the `accessibilityValue` to the current number value.

#### `accessibilityRole` (static)

_Currently supported on iOS_

Type: one of `"none"`, `"button"`, `"link"`, `"search"`, `"image"`, `"keyboardkey"`, `"text"`, `"adjustable"`, `"imagebutton"`, `"header"`, `"summary"`

These presets determine the high level behavior of the layer. Currently this list is taken from React Native and should handle mobile fairly well, but there may be more to add for web.

#### `accessibilityElements` (static & dynamic†)

_Supported on iOS & web_

Type: `Array<String>`

This can be set after `accessibilityType` has been set to `container`. This is the list of descendant layers which assistive technologies should read. Any layer specified in this array will likely also need its own `accessibilityType` set to `elements`.

† - can only be assigned an array of hardcoded values. E.g. different conditional branches can assign different sets of hardcoded values. These are transformed at compile-time.

#### `accessibilitySelectedState` (dynamic)

_Not supported yet_

Type: `Boolean`

Use this for interactive controls that have selectable elements, e.g. a list of tabs. In a list of tabs, each tab will be _focusable_, but likely only one will be _selected_ at any time.

#### `accessibilityDisabledState` (dynamic)

_Not supported yet_

Type: `Boolean`

Use this for interactive controls that can't currently be interactive with, e.g. a "submit" button in a form when some of the required fields are empty.

#### `onAccessibilityActivate` (dynamic)

_Supported on iOS & web_

Type: `Function<Void> -> Void`

A callback for when an element is activated via keyboard or assistive technologies. This is analogous to `onPress`, and should often do the same thing.

## Swift

### iOS

To access accessibility parameters which aren't configurable through Lona, use the `accessLevel` metadata property to set the `UIView` from `private` to `public`. This can be configured in the Metadata section of the layer inspector in Lona Studio:

![Metadata inspector](https://i.imgur.com/oEfEzsy.png)

Create a new row by clicking the "+" button at the bottom, then set the access level of this layer to `public`.

![Set access level](https://i.imgur.com/eHm0KoZ.png)

### macOS

Accessibility parameters are disabled for now.

## JavaScript

### Web

All layers with an `accessibilityType` of `element` are focusable by keyboard.

The underlying DOM node for a focusable layer has `tabindex` set to `-1`. This means that the element must be focused either programatically, or by click.

Components manage the tab order and keyboard events for the focusable DOM nodes within them. In other words, to support keyboard navigation, you'll need to programatically initiate focus on the component as a whole, but the component will choose which DOM node within needs to be focused, and after that the component will handle the `Tab` key itself.

To focus a component, you'll need to store a React `ref` to that component. Components that contain accessible layers have the following ref-based API methods:

#### Component methods

- **`focus(options)`** - Call this method to focus the first focusable DOM node in the component.

- **`focusNext(options)`** - Call this method to focus the next focusable DOM node in the component. If focus is not currently on a DOM node within this component, then the first focusable node is focused. If focus is on the last node within this component, focus is not changed, and instead the `onFocusNext` prop is called.

- **`focusPrevious(options)`** - Call this method to focus the previous focusable DOM node in the component. If focus is on the first node within this component, focus is not changed, and instead the `onFocusPrevious` prop is called.

Each of these methods can be passed an `options` object, containing:

- **`focusRing`** _(bool)_ - Should the focused element show an outline? If set to false, the outline is hidden with `:focus { outline: 0; }`.

By default, clicking on a focusable DOM node will _not_ show the focus ring. Only keyboard navigation will show the focus ring.

#### Component props

Components that contain accessible layers may be passed the following props:

- **`onFocusNext`** _(function)_ - This function is called when the focus is on the last focusable DOM node within the component and the user presses `Tab`. Within this callback, you should programatically set focus on the next component in the UI.

- **`onFocusPrevious`** _(function)_ - This function is called when the focus is on the first focusable DOM node within the component and the user presses `Shift+Tab`. Within this callback, you should programatically set focus on the previous component in the UI.

### React Native

Some of the parameters are mapped to React Native, but I haven't tested how well everything works yet.