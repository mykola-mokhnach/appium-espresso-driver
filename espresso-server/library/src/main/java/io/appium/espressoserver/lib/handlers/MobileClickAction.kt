/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.appium.espressoserver.lib.handlers

import androidx.test.espresso.action.GeneralClickAction
import io.appium.espressoserver.lib.handlers.exceptions.AppiumException
import io.appium.espressoserver.lib.model.EspressoElement
import io.appium.espressoserver.lib.model.MobileClickActionParams

class MobileClickAction : RequestHandler<MobileClickActionParams, Void?> {

    @Throws(AppiumException::class)
    override fun handleInternal(params: MobileClickActionParams): Void? {
        val clickAction = GeneralClickAction(
            params.tapper,
            params.coordinatesProvider,
            params.precisionDescriber,
            params.inputDevice,
            params.buttonState
        )
        val viewInteraction = EspressoElement.getViewInteractionById(params.elementId)
        viewInteraction.perform(clickAction)
        return null
    }
}
