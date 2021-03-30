import { API_URL } from "@app/constants";
import getAuthToken from "@app/utils/getAuthToken";

export interface DeleteOneProps {
  id: string;
  clientId?: string;
}

const deleteOne = async ({ id, clientId }: DeleteOneProps) => {
  if (clientId) {
    // can't delete until there's an id created by the server
    throw Error("Unable to delete right now");
  }

  const token = await getAuthToken();
  const fetchOptions: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: token,
    },
  };

  const response = await fetch(`${API_URL}/todo/${id}`, fetchOptions);
  const data: { id: string } = await response.json();
  return data.id;
};

export default deleteOne;
