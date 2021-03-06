#Crypto Cash

Desired properties of digital cash to be practical:
- works offline
- no batteries
- proves validity
- forgery prove
- easily convertable into "online" money (Ethereum | SEPA, Paypal, ... )
- dezentralized cash creation  
- open source
- works on everyday hardware


## Ideas 

All ideas presented here assume that there is given a crypto-currency (such as bitcoin, litecoin, ethereum,... ) to back the cash's value 1:1.

In the following _XCC_ means "any such crypto-currency". 

Every cash design is designed to hold a secret that allows the owner of the cash to transfer the cash's value into his XCC wallet (where it can be considered to be secure). 

In the following to _redeem_ cash means "neutralize the cash by transfering it's value to receiver's XCC wallet." (via internet connection)

### General considerations regarding the security model
Attack surface 
- Attacker reads and copies the secret, spends the cash and redeems it before the receiver redeems it.
- The creator of the cash knows the secret.

Assumptions 
- for offline transactions the cash can't be 100% copy-prove.
- the cash doesn't need to be 100% copy-prove. It just needs to be more expensive to copy the secret, than the cash is worth. 

### One-time self-printed cash 
- everybody with internet connection, app and printer can print his's own cash.
- cash receiver scans the cash and redeems it immediatly. 
- if the amount appears in receiver's XCC wallet, the transaction was valid and secure. 

### NFC/RFID-based one-time cash
- same system as self-printed, but with reusable RFID tokens
  - everyone can rewrite public key and secret 


### interactive proof with RF-powered computation 
- the cash never reveals it's secret to anybody
- but it can prove to anybody that it knows the secret
  - the verifier encrypts a random string with the cash's public key and sends the encrypted text to the cash. If the cash can tell the plain text, it probably knows the private key. (zero-knowledge proof) 
  
  
## One-time self-printed cash
Simple App to print out bills that are actually private keys of an XCC wallet.
Those bills are charged by transfering XCC to the wallet it represents.
The receiver needs an app with internet connection to transfer the bill's value into his personal XCC wallet. 

Pros: 
- "Most users have access to a printer"
  - very practical and robust decentralized cash creation.
  - cost for cash creation and creation hardware is negligible. 
- "Perfectly" trust once the receiver transfered the cash to his wallet.
- Perfect offline transfer between partys who trust each other.
- Perfect physical storage
- Cash's secret can be created 100% offline. (But not charging the cash) 

Cons:
- The cash's secret is public 
  - Receiver needs internet connection to trust the cash.
  - As easy as it is to create this cash, it is easy to forge it. 
- Non reusable one-time solution.
  - Cash can not flow from one receiver to the next receiver (securely).
- How does change (cash float) work? 
  - Point of sale needs a printer.
 
### Improvements 
- cash could be encrypted such that you need a password to spend it.
- cash could be signed by an trustworty authority. 
  - this slightly increases the trustworthyness of offline transactions because you can check offline if the cash was ever validly charged (but not if it was copied or spent already). 
- it could be (mechanically) folded and glued together, such that the secret is sealed. 
  - this slightly increases the trustworthyness of offline transactions because if it is signed and sealed it is a little harder to copy it. 
  - This assumes the cash was created and signed by an authority that is trusted by the receiver (bc the creator of the cash knows the secret).

## Candidates for XCC

### Requirements
 Requirements for the backing crypto-currency: 
  - secure and trustworthy
  - stable and robust 
  - decentralized 
  - fast and scalabale transactions (validation < 20s)
  - stable community
  - decentralized mining (ASIC resistant)
  - good ecological footprint


Nice to have 
 - a cash design that is independent of a specific blockchain currency. 

## Candidates 
- Bitcoin
- Ethereum 
- LiteCoin
