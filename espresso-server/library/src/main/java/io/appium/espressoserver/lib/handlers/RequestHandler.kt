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

import io.appium.espressoserver.lib.drivers.DriverContext
import io.appium.espressoserver.lib.drivers.DriverContext.StrategyType
import io.appium.espressoserver.lib.handlers.exceptions.AppiumException
import io.appium.espressoserver.lib.handlers.exceptions.NoSuchDriverException
import io.appium.espressoserver.lib.handlers.exceptions.NotYetImplementedException
import io.appium.espressoserver.lib.helpers.AndroidLogger
import io.appium.espressoserver.lib.model.AppiumParams
import io.appium.espressoserver.lib.model.GlobalSession

interface RequestHandler<in T : AppiumParams, out R> {
    fun handleInternal(params: T): R = invokeStrategy(params)

    @Suppress("UNCHECKED_CAST")
    fun invokeStrategy(params: AppiumParams): R =
        when (DriverContext.currentStrategyType) {
            StrategyType.COMPOSE -> handleCompose(params as T)
            StrategyType.ESPRESSO -> handleEspresso(params as T)
        }

    fun handleEspresso(params: T): R {
        throw NotYetImplementedException()
    }

    fun handleCompose(params: T): R {
        throw NotYetImplementedException()
    }

    @Suppress("UNCHECKED_CAST")
    @Throws(AppiumException::class)
    fun handle(params: AppiumParams): R {
        AndroidLogger.info("Executing ${this::class.simpleName} handler")

        if (this !is NoSessionCommandHandler
            && (params.sessionId == null || params.sessionId != GlobalSession.sessionId)
        ) {
            throw NoSuchDriverException("The requested session id ${params.sessionId} does not exist")
        }

        return handleInternal(
            params as? T
                ?: throw IllegalArgumentException(
                    "Invalid type ${params::class.simpleName} " +
                            "passed to ${this::class.simpleName} handler"
                )
        )
    }
}
