import {
  EllipsisIcon,
  PlusIcon,
  WalletIcon,
} from "@bitcoin-design/bitcoin-icons-react/filled";
import { useNavigate } from "react-router-dom";

import api from "../../common/lib/api";
import Button from "../components/Button";
import Container from "../components/Container";
import Menu from "../components/Menu";
import { useAuth } from "../context/AuthContext";
import { useAccounts } from "../context/AccountsContext";

function AccountsScreen() {
  const auth = useAuth();
  const { accounts, getAccounts } = useAccounts();
  const navigate = useNavigate();

  async function selectAccount(accountId: string) {
    auth.setAccountId(accountId);
    await api.selectAccount(accountId);
    auth.fetchAccountInfo(accountId);
  }

  async function removeAccount(id: string, name: string) {
    if (window.confirm(`Are you sure you want to delete account: ${name}?`)) {
      let nextAccountId;
      let accountIds = Object.keys(accounts);
      if (auth.account?.id === id && accountIds.length > 1) {
        nextAccountId = accountIds.filter((accountId) => accountId !== id)[0];
      }

      await api.deleteAccount(id);
      accountIds = accountIds.filter((accountId) => accountId !== id);

      if (accountIds.length > 0) {
        getAccounts();
        if (nextAccountId) selectAccount(nextAccountId);
      } else {
        window.close();
      }
    }
  }

  return (
    <Container>
      <h2 className="mt-12 mb-6 text-2xl font-bold dark:text-white">
        Accounts
      </h2>
      <div className="shadow border-b border-gray-200 dark:border-gray-600 sm:rounded-lg bg-white dark:bg-gray-800">
        <div className="p-6">
          <Button
            icon={<PlusIcon className="w-5 h-5" />}
            label="Add account"
            primary
            onClick={() => navigate(`/accounts/new`)}
          />
        </div>
        <table className="min-w-full">
          <tbody className="divide-y divide-gray-200">
            {Object.keys(accounts).map((accountId) => {
              const account = accounts[accountId];
              return (
                <tr key={accountId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 flex justify-center items-center rounded-full bg-orange-bitcoin-50">
                        <WalletIcon className="w-8 h-8 text-black" />
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {account.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {account.connector}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative">
                      <Menu.Button className="ml-auto flex items-center text-gray-500 hover:text-black transition-color duration-200 dark:hover:text-white">
                        <EllipsisIcon className="h-6 w-6 rotate-90" />
                      </Menu.Button>
                      <Menu.List position="right">
                        <Menu.ItemButton
                          onClick={() => removeAccount(accountId, account.name)}
                        >
                          Delete
                        </Menu.ItemButton>
                      </Menu.List>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default AccountsScreen;
