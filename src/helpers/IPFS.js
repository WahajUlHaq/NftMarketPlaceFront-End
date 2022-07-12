import crypto from "crypto";

export const addImageToIPFSServer = async (data) => {
  try {
    let headers = new Headers();

    let formData = new FormData();
    formData.append("", data.file, data.title);

    let requestParams = {
      method: "POST",
      headers: headers,
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(
      "https://ipfs.infura.io:5001/api/v0/add",
      requestParams
    );

    return response.json();
  } catch (e) {
    alert(e.message);
  }
};

export const addObjectToIPFSServer = async (data) => {
  try {
    let headers = new Headers();
    let formData = new FormData();
    const randomByteStr = crypto.randomBytes(4).toString("hex");
    const objStringified = JSON.stringify(data);
    const objBytes = new TextEncoder().encode(objStringified);
    const blob = new Blob([objBytes], {
      type: "application/json;charset=utf-8",
    });

    formData.append("", blob, `metadata_${randomByteStr}.json`);

    let requestParams = {
      method: "POST",
      headers: headers,
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(
      "https://ipfs.infura.io:5001/api/v0/add",
      requestParams
    );

    return response.json();
  } catch (e) {
    alert(e.message);
  }
};
