import { util } from 'appium/support';
import { errors } from 'appium/driver';

/**
 * Emulates key press event.
 *
 * @this {import('../driver').EspressoDriver}
 * @param {number} keycode A valid Android key code. See https://developer.android.com/reference/android/view/KeyEvent
 * for the list of available key codes
 * @param {number} [metastate] An integer in which each bit set to 1 represents a pressed meta key. See
 * https://developer.android.com/reference/android/view/KeyEvent for more details.
 * @param {number} [flags] Flags for the particular key event. See
 * https://developer.android.com/reference/android/view/KeyEvent for more details.
 * @param {boolean} [isLongPress=false] Whether to emulate long key press
 */
export async function mobilePressKey (
  keycode,
  metastate,
  flags,
  isLongPress = false,
) {
  await this.espresso.jwproxy.command(`/appium/device/${isLongPress ? 'long_' : ''}press_keycode`, 'POST', {
    keycode, metastate, flags
  });
}

/**
 * @this {import('../driver').EspressoDriver}
 * @returns {Promise<import('../types').DeviceInfo>}
 */
export async function mobileGetDeviceInfo () {
  return /** @type {import('../types').DeviceInfo} */ (await this.espresso.jwproxy.command('/appium/device/info', 'GET'));
}

/**
 * @this {import('../driver').EspressoDriver}
 * @see https://github.com/appium/appium-espresso-driver?tab=readme-ov-file#mobile-istoastvisible
 * @param {string} text
 * @param {boolean} [isRegexp]
 */
export async function mobileIsToastVisible (text, isRegexp) {
  if (!util.hasValue(text)) {
    throw new errors.InvalidArgumentError(`'text' argument is mandatory`);
  }
  return await this.espresso.jwproxy.command('/appium/execute_mobile/is_toast_displayed', 'POST', {
    text,
    isRegexp,
  });
}

/**
 * @this {import('../driver').EspressoDriver}
 * @returns {Promise<number>}
 */
export async function getDisplayDensity () {
  return /** @type {number} */ (await this.espresso.jwproxy.command(
    '/appium/device/display_density', 'GET', {})
  );
}
/**
 *  API to invoke methods defined in Android app.
 *
 *  Example data
 *  {
 *   target: 'activity',
 *   methods:
 *         [
 *           {
 *               name: "someMethod",
 *           },
 *           {
 *               name: "anotherMethod",
 *               args:
 *                   [
 *                       {value: "Lol", type: 'java.lang.CharSequence'},
 *                       {value: 1, type: 'int'}
 *                   ]
 *           }
 *         ]
 * }
 *
 * In above example, method "someMethod" will be invoked on 'activity'. On the result, "anotherMethod" will be invoked
 *  "target" can be either 'activity', 'application' or 'element'
 *  If target is set to 'application', methods will be invoked on application class
 *  If target is set to 'activity', methods will be invoked on current activity
 *  If target is set to 'element', 'elementId' must be specified
 *
 * - Only 'Public' methods can be invoked. ('open' modifire is necessary in Kotlin)
 * - following primitive types are supported: "int", "boolean", "byte", "short", "long", "float", "char"
 * -  Non-primitive types with fully qualified name "java.lang.*" is also supported:
 *                              Eg. "java.lang.CharSequence", "java.lang.String", "java.lang.Integer", "java.lang.Float",
 *                              "java.lang.Double", "java.lang.Boolean", "java.lang.Long", "java.lang.Short",
 *                              "java.lang.Character" etc...
 *
 *
 * @throws {Error} if target is not 'activity' or 'application'
 * @throws {Error} if a method is not found with given argument types
 * @this {import('../driver').EspressoDriver}
 * @see https://github.com/appium/appium-espresso-driver?tab=readme-ov-file#mobile-backdoor
 * @param {string} target
 * @param {import('@appium/types').StringRecord[]} methods
 * @param {string} [elementId]
 * @return {Promise<any>} the result of the last method in the invocation chain.
 * If method return type is void, then "<VOID>" will be returned
 */
export async function mobileBackdoor (
  target,
  methods,
  elementId,
) {
  if (target === 'element' && !elementId) {
    throw new errors.InvalidArgumentError(`'elementId' is required if 'target' equals to 'element'`);
  }
  return await this.espresso.jwproxy.command(`/appium/execute_mobile/backdoor`, 'POST', {
    target, methods, targetElement: elementId
  });
}

/**
 *  Execute UiAutomator2 commands to drive out of app areas.
 *  strategy can be one of: "clazz", "res", "text", "textContains", "textEndsWith", "textStartsWith",
 *                          "desc", "descContains", "descEndsWith", "descStartsWith", "pkg"
 *
 *  action can be one of: "click", "longClick", "getText", "getContentDescription", "getClassName",
 *                        "getResourceName", "getVisibleBounds", "getVisibleCenter", "getApplicationPackage",
 *                        "getChildCount", "clear", "isCheckable", "isChecked", "isClickable", "isEnabled",
 *                        "isFocusable", "isFocused", "isLongClickable", "isScrollable", "isSelected"
 * @this {import('../driver').EspressoDriver}
 * @see https://github.com/appium/appium-espresso-driver?tab=readme-ov-file#mobile-uiautomator
 * @param {string} strategy
 * @param {string} locator
 * @param {string} action
 * @param {number} [index]
 */
export async function mobileUiautomator (
  strategy,
  locator,
  action,
  index
) {
  return await this.espresso.jwproxy.command(`/appium/execute_mobile/uiautomator`, 'POST', {
    strategy, locator, index, action
  });
}

/**
 * Execute UiAutomator2 command to return the UI dump when AUT is in background.
 * @this {import('../driver').EspressoDriver}
 * @throws  {Error} if uiautomator view dump is unsuccessful
 * @returns {Promise<string>} uiautomator DOM xml as string
 */
export async function mobileUiautomatorPageSource () {
  return /** @type {string} */ (await this.espresso.jwproxy.command(
    `/appium/execute_mobile/uiautomator_page_source`, 'GET'
  ));
}

/**
 * @typedef {Object} SettingsOptions
 * @property {!string|number|boolean} Object Settings parameters that is available in
 * https://github.com/appium/appium-espresso-driver#settings-api or enabled plugins.
 */

/**
 * Apply the given settings to the espresso driver and the espresso server.
 * Errors by the espresso server will be printed as log, but it does not return an error message.
 * @param {SettingsOptions} settings
 * @this {import('../driver').EspressoDriver}
 */
export async function updateSettings (settings) {
  await this.settings.update(settings);
  try {
    await this.espresso.jwproxy.command(`/appium/settings`, 'POST', { settings });
  } catch (err) {
    this.log.warn(`The espresso driver responded an error. Original error: ${err.message}`);
  }
}

/**
 * @this {import('../driver').EspressoDriver}
 */
export async function getSettings () {
  const driverSettings = this.settings.getSettings();
  const serverSettings = /** @type {Record<String, any>} */ (await this.espresso.jwproxy.command(
    `/appium/settings`, 'GET'
  ));
  return {...driverSettings, ...serverSettings};
}


