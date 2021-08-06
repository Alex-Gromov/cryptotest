import KeyEncoder from 'key-encoder';
import CryptoJS from 'crypto-js'

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


export async function getStaticProps(context: WalletInstance) {
  return {
    props: {
      user: {
        id: "userId_73"
      }
    }
  }
}

let originalText: string
let ciphertext: string
let bytes: any


const createKeys = async () => {
  //generate random encrypted string
  const randCrypt = (await import('crypto-random-string')).default;
  const randCryptStr = randCrypt({length: 50, type: 'base64'});
  
  //generate keys with random encrypted string. New ones with every new session
  const keyEncoder = new KeyEncoder('secp256k1');
  const pemPublicKey = keyEncoder.encodePublic(randCryptStr, 'raw', 'pem').slice(26, -24).trim();
  const pemPrivateKey = keyEncoder.encodePrivate(randCryptStr, 'raw', 'pem').slice(30, -29).trim();
  
  sessionStorage.setItem('publicKey', pemPublicKey);
  sessionStorage.setItem('privateKey', pemPrivateKey);

  console.log("public key: ", pemPublicKey)
  console.log("private key: ", pemPrivateKey)
}


const encryptData = () => {
  ciphertext = CryptoJS.AES.encrypt('rand_str_2_encode', 'secret key 123').toString();
  bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
  console.log("encrepted text: ", ciphertext)
}

const decryptData = () => {
  originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.log('decrepted text: ', originalText)
}



const Home: React.FC = () => {
  const generateKeys = (e: React.MouseEvent<HTMLButtonElement>) => {
    createKeys()
  }
  
  const encrypt = (e: React.MouseEvent<HTMLButtonElement>) => {
    let localPublicKey = sessionStorage.getItem('publicKey');
    if(localPublicKey) {
      encryptData()
    }
  }
  
  const decrypt = (e: React.MouseEvent<HTMLButtonElement>) => {
    let localPrivateKey = sessionStorage.getItem('privateKey');
    if(localPrivateKey) {
      decryptData()
    }
  }
  
  return (
    <div>
      <button onClick={generateKeys}>Generate keys</button><hr />
      <button onClick={encrypt}>Encrypt</button><hr />
      <button onClick={decrypt}>Decrypt</button>
      <hr />
    </div>
  )
}

export default Home;