/**
 * 
 * Tests related with User methods
 * 
 * @requires jest
 * @requires supertest
 * @requires app
 * @requires User
 * @requires fixtures/db package
 * 
 */
const request  = require("supertest");
const app      = require("../src/app");
const User     = require("../src/models/user");
const { userOneId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

/**
 * 
 * JEST every run methods
 * that function works with @package fixtures/db
 * @method beforeEach every test case it will drop user collection.
 * 
 */
beforeEach( setupDatabase );

/**
 * User tests
 * @uses supertest
 */
test( 'Should sign up a new user', async () => {

    /**
     * Always IIt should start with a clean users collection
     * @see We can get the response as a normal variable.
     */
    const response = await request(app).post( '/users').send({
        name: 'José',
        email: 'duque@gmail.com',
        password: 'MyPass777!'
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById( response.body.user._id );
    expect(user).not.toBeNull();

    // Assertions about the response
    // expect(response.body.user.name).toBe('José');
    expect(response.body).toMatchObject({
        user: {
            name: 'José',
            email: 'duque@gmail.com'
        },
        token: user.tokens[0].token
    }); // Checking if response is a valid user object

    // Assert the password is not plaintext
    expect(user.password).not.toBe('MyPass777!');
});

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    /**
     * Check if second token user (is logged) exists after login.
     */
    const user = await User.findById( userOneId );
    expect( response.body.token ).toBe( user.tokens[1].token );
});

test('Should failure at non-existing login user', async () => {
    await request(app).post('/users/login').send({
        email: userTwo.email,
        password: userTwo.password
    }).expect(200);
});

test('Should get profile for user', async () => {

    /**
     * We need to include authorization header to be authenticated.
     * @param set
     */
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should delete account of user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .send()
        .expect(200)

    /**
     * Check if user is removed
     */
    const user = await User.findById( userOneId );
    expect( user ).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

/**
 * Avatar tests
 */
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .attach( 'avatar', 'tests/fixtures/profile-pic.jpg') // File attachment on the supertest request (take care of using attach and send at same time)
        .expect(200)
    
    const user = await User.findById( userOneId );

    /**
     * @use expect.any( Type ) to check a primitive value type
     */
    expect( user.avatar ).toEqual(expect.any(Buffer)); // Use toEqual to compare objects
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Sofía'
        })
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .expect(200)
    const user = await User.findById( userOneId );
    expect( user.name ).toBe( 'Sofía' );
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            location: 'Oklahoma'
        })
        .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
        .expect(400)
});

/**
 * @todo Users tests to check
 * 
 * Should not signup user with invalid name/email/password
 * Should not update user if unauthenticated
 * Should not update user with invalid name/email/password
 * Should not delete user if unauthenticated
 * 
 */