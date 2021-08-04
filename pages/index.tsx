import React, { useState, useEffect } from "react";
import KeyEncoder from 'key-encoder';
import {Base64} from 'js-base64';

interface WalletInstance {
  user: {
    id: number | string;
  }
}

const wallet: WalletInstance = {
  user: {
    id: "userId_73"
  }
}

const keyEncoder = new KeyEncoder('secp256k1');
let rawKey = wallet.user.id.toString();

export async function getStaticProps(context: WalletInstance) {
  return {
    props: {
      user: {
        id: "userId_73"
      }
    }
  }
}


const Home: React.FC = () => {
  const [encryptedData, setEncryptData] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  
  const generateKeys = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //generate random encrypted string
    const randCrypt = (await import('crypto-random-string')).default;
    const randCryptStr = randCrypt({length: 50, type: 'base64'});
    console.log("random encrypted string: ",randCryptStr)
    
    //generate keys with random encrypted string. New ones with every new session
    const pemPublicKey = keyEncoder.encodePublic(randCryptStr, 'raw', 'pem').slice(26, -24).trim();
    const pemPrivateKey = keyEncoder.encodePrivate(randCryptStr, 'raw', 'pem').slice(30, -29).trim();

    setPublicKey(pemPublicKey);
    setPrivateKey(pemPrivateKey);

    console.log("public key: ", pemPublicKey)
    console.log("private key: ", pemPrivateKey)
  }
  
  useEffect(() => {
    sessionStorage.setItem('publicKey', publicKey);
    sessionStorage.setItem('privateKey', privateKey);
  },[publicKey, privateKey])
  
  const encryptInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    let localPublicKey = sessionStorage.getItem('publicKey');
    if(localPublicKey) {
      const encryptedData = Base64.encode(rawKey)
      console.log("encrypted:", encryptedData)
      setEncryptData(encryptedData)
    }
  }

  const decryptInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    let localPrivateKey = sessionStorage.getItem('privateKey');
    if(localPrivateKey) {
      let decryptedData: string = Base64.decode(encryptedData)
      console.log("decrypted:", decryptedData)
    }
  }

  return (
    <div>
      <button onClick={generateKeys}>Generate keys</button><hr />
      <button onClick={encryptInput}>Encrypt</button><hr />
      <button onClick={decryptInput}>Decrypt</button>
    </div>
  )
}

export default Home;