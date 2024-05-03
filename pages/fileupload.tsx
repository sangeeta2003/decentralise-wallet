import React, { ChangeEvent, useState } from "react";
import { create } from "ipfs-http-client";
const str: any = new URL("https://ipfs.infura.io:5001/api/v0");
// const client = create(str)
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
const auth =
  "Basic " +
  Buffer.from(
    "6ce21417045e4e9aad2029cf2bd24fbb" +
      ":" +
      "38fa43e497dc45b08caf77c79278fb98"
  ).toString("base64");
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
interface IProps {
  share: any;
}
const FileUploadPage: React.FC<IProps> = ({ share }) => {
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileHash, updateFileUrl] = useState(``);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.currentTarget.files as FileList;
    setSelectedFile(files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = async () => {
    try {
      const added = await client.add(selectedFile);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(added.path);
      console.log({ hash: added.path });
      console.log(added.path);

      share({ hash: added.path });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  return (
    <div className="FileUpload">
      <form method="POST" encType="multipart/form-data">
        <label htmlFor="file" className="uploadLabel">
          <input
            type="file"
            id="file"
            name="file"
            onChange={changeHandler}
            className="choose-file"
          />
        </label>
        {isFilePicked ? (
          <div className="remarks">
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
          </div>
        ) : (
          <p className="remarks">Select file to upload and click submit</p>
        )}
      </form>
      <button className="submit" onClick={handleSubmission}>
        Submit
      </button>
    </div>
  );
};

export default FileUploadPage;
