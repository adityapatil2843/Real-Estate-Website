import jwt from 'jsonwebtoken'


const genToken = (userId)=>{

  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {expiresIn: "7d",});
    console.log("TOKEN TYPE:", typeof token);
    console.log("TOKEN VALUE:", token);
    return token
  } catch (error) {
    return res.status(500).json(`gen token error ${error}`)
    
  }

}

export default genToken