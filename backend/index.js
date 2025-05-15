import connection from './configs/db';
import { hash as _hash, compare } from 'bcrypt';
import { create, findOne } from './models/User.module';
import { sign } from 'jsonwebtoken';
import blogRouter from './Router/blog.Routes';
import { autentication } from './middleware/authentication';
import cors from 'cors';
import express, { json } from 'express';
const app= express();
app.use(json());
app.use(cors());



app.get('/', (req,res)=>{
    res.send({'app runing u are on home page now ': req.headers});
});

app.post('/signup', async (req,res)=>{
    const { name , email , password} = req.body;
    try {
           _hash(password, 4, async function(err, hash) {
           await  create({name : name , email : email , password : hash});
           res.send({ msg : ' sign up succusfull ' ,name : name , email : email , password : hash});
        });
           
    } catch (error) {
        console.error(error);
        res.send('sign up failed');
    }
}
);



app.post('/login', async (req, res) => {
    const { email, password } = req.body; 
    try {
        const user = await findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }


        compare(password, user.password, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                const token = sign({userId: user._id}, 'secret');
                console.log(result);
                return res.json({ msg: 'Login successful', token});
            } else {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});




app.use(autentication);
app.use('/blogs', blogRouter);
  
app.listen(7000, async ()=>{
  await connection;
console.log('app runing at port 7000');
})

