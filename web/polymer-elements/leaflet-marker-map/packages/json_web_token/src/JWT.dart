part of json_web_token;

//openssl pkcs12 -in privatekey.p12 -nocerts -passin pass:notasecret -nodes -out rsa_private_key.pem

class JWTStore {
  static JWTStore CURRENT;
  static JWTStore getCurrent(){
    if (CURRENT == null) {
      CURRENT = new JWTStore();
    }
    return CURRENT;
  }

  Map<String, RSAPrivateKey> iss_privateKeys = {};
  Map<String, Map<String, JWT>> _store = {};

  void registerKey(String isss, String pemkey, {String password}){
    rsa_pkcs.RSAPKCSParser parser = new rsa_pkcs.RSAPKCSParser();
    rsa_pkcs.RSAPrivateKey pk = parser.parsePEM(pemkey, password:password).private;
    RSAPrivateKey privk = new RSAPrivateKey(pk.modulus, pk.privateExponent, pk.prime1, pk.prime2);
    iss_privateKeys[isss]=privk;
    _store[isss] = {};
  }

  Future<JWT> generateJWT(String isss , String scopes){
    JWT jwt;
    if (_store[isss].containsKey(scopes)){
      jwt = _store[isss][scopes];
      if (jwt.isExpired){
        jwt = new JWT(isss, scopes);
        return jwt.generateAuthUsingKey(iss_privateKeys[isss]).then((_){
          _store[isss][scopes] = jwt;
          return jwt;
        });
      } else {
        return new Future.value(jwt);
      }
    } else {
      jwt = new JWT(isss, scopes);
      return jwt.generateAuthUsingKey(iss_privateKeys[isss]).then((_){
        _store[isss][scopes] = jwt;
        return jwt;
      });
    }
  }
}

class JWT {
  Map header;
  Map clain;
  Map auth;
  int iat;

  String get accessToken => auth["access_token"];

  JWT(String iss, String scopes){
    header = {"alg":"RS256","typ":"JWT"} ;
    DateTime now = new DateTime.now();
    iat = now.millisecondsSinceEpoch ~/ 1000;
    int exp = iat + 3500;
    clain = {"iss":iss,
                 "scope":scopes,
                 "aud":"https://accounts.google.com/o/oauth2/token",
                 "exp":exp,
                 "iat":iat};
  }

  bool get isExpired {
    DateTime now = new DateTime.now();
    return iat >= auth["expires_in"] + (now.millisecondsSinceEpoch ~/ 1000);
  }

  Future generateAuth(String privateKeyFile){
    return _generateJWT(privateKeyFile).then((jwt){
      Map map = {"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                 "assertion":jwt};
      HttpClient httpclient = new HttpClient();
      return httpclient.postUrl(Uri.parse("https://accounts.google.com/o/oauth2/token")).then((HttpClientRequest request) {
        request.headers.add("Content-Type", "application/x-www-form-urlencoded");
        request.write(_mapToQuery(map));
        return request.close();
      })
        .then((HttpClientResponse response) {
          return response.toList().then((list){
            auth = JSON.decode(new String.fromCharCodes(list.expand((i) => i)));
            if (auth['error'] != null) {
              throw new AuthorizationError(auth['error_description']);
            }
            return auth;
          });
        });
    });
  }

  Future generateAuthUsingKey(RSAPrivateKey privateKey){
      return _generateJWTUsingKey(privateKey).then((jwt){
        Map map = {"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                   "assertion":jwt};
        HttpClient httpclient = new HttpClient();
        return httpclient.postUrl(Uri.parse("https://accounts.google.com/o/oauth2/token")).then((HttpClientRequest request) {
          request.headers.add("Content-Type", "application/x-www-form-urlencoded");
          request.write(_mapToQuery(map));
          return request.close();
        })
          .then((HttpClientResponse response) {
            return response.toList().then((list){
              auth = JSON.decode(new String.fromCharCodes(list.expand((i) => i)));
              if (auth['error'] != null) {
                throw new AuthorizationError(auth['error_description']);
              }
              return auth;
            });
          });
      });
    }

  String _base64Encode(List<int> bytes){
    String e = CryptoUtils.bytesToBase64(bytes, urlSafe: true);
    return e.split("=").first;
  }

  Future<String> _generateJWT(String privateKeyFile){
      return new Future.sync((){
        String bheader = _base64Encode(JSON.encode(header).codeUnits);
         String bclain = _base64Encode(JSON.encode(clain).codeUnits);
         String headerclain = "$bheader.$bclain";
         return signOpenSSL(headerclain, privateKeyFile).then((bytes){
           String bsig =  CryptoUtils.bytesToBase64(bytes, urlSafe: true);
          return "$headerclain.$bsig";
         });
      });
    }

  Future<String> _generateJWTUsingKey(RSAPrivateKey privateKey){
    return new Future.sync((){
      String bheader = _base64Encode(JSON.encode(header).codeUnits);
       String bclain = _base64Encode(JSON.encode(clain).codeUnits);
       String headerclain = "$bheader.$bclain";
       return sign(headerclain, privateKey).then((bytes){
         String bsig =  CryptoUtils.bytesToBase64(bytes, urlSafe: true);
        return "$headerclain.$bsig";
       });
    });
  }

  Future<List<int>> signOpenSSL(String msg, String privateKeyFile){
    return Process.start('openssl', ['sha', '-sha256' , '-sign' , privateKeyFile]).then((Process process) {
      var bytes = [];
      stderr.addStream(process.stderr);
      StreamSubscription sub = process.stdout.listen((b)=>bytes.addAll(b));
      process.stdin..write(msg)..close();
      return process.exitCode.then((code){
        return bytes;
      });
    });
  }

  Future<List<int>> sign(String msg, RSAPrivateKey privk){
    return new Future.sync((){
      initCipher();
      Signer signer = new Signer("SHA-256/RSA");
      signer.reset();
      signer.init(true, new ParametersWithRandom(new PrivateKeyParameter<RSAPrivateKey>(privk), getSecureRandom()));
      RSASignature signature = signer.generateSignature(new Uint8List.fromList(msg.codeUnits));
      return signature.bytes;
    });
  }


  String _mapToQuery(Map<String, String> map, {Encoding encoding}) {
    var pairs = <List<String>>[];
    map.forEach((key, value) =>
        pairs.add([Uri.encodeQueryComponent(key ),
                   Uri.encodeQueryComponent(value)]));
    return pairs.map((pair) => "${pair[0]}=${pair[1]}").join("&");
  }

  SecureRandom getSecureRandom(){
      return new NullSecureRandom();
    }
}

class NullSecureRandom extends SecureRandomBase {
  var _nextValue=0;
  String get algorithmName => "Null";
  void seed(CipherParameters params) {}
  int nextUint8() => 0;
}

class AuthorizationError extends Error {
  String error;
  
  AuthorizationError(this.error);
  
  String toString() => "Authorisation error: $error";
}