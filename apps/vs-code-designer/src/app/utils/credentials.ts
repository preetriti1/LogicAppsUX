/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { ServiceClientCredentials } from '@azure/ms-rest-js';
import { commands, extensions, authentication } from 'vscode';
import { ext } from '../../extensionVariables';

export const getAccountCredentials = async (tenantId?: string): Promise<any | undefined> => {
  const extension = extensions.getExtension('ms-vscode.azure-account');
  let currentLoggedInSessions: any;
  const scopes = ['https://management.core.windows.net//.default'];
  if (tenantId) {
    scopes.push(`VSCODE_TENANT:${tenantId}`);
  }
  const session = await authentication.getSession('microsoft', scopes, {
    createIfNone: false,
  });
  ext.outputChannel.appendLine(`accesstoken, ${session.accessToken}`);

  console.log(session);

  if (extension) {
    if (!extension.isActive) {
      await extension.activate();
    }
    const azureAccount = extension.exports;
    if (!(await azureAccount.waitForLogin())) {
      await commands.executeCommand('azure-account.askForLogin');
    }

    await azureAccount.waitForFilters();
    currentLoggedInSessions = azureAccount.sessions;
  }

  if (currentLoggedInSessions) {
    return getCredentialsForSessions(currentLoggedInSessions, tenantId);
  }

  return undefined;
};

const getCredentialsForSessions = (sessions: any, tenantId?: string): ServiceClientCredentials => {
  if (tenantId) {
    const tenantDetails = sessions.filter((session) => session.tenantId.toLowerCase() === tenantId);
    return tenantDetails.length ? tenantDetails[0].credentials2 : sessions[0].credentials2;
  }
  return sessions[0].credentials2;
};
