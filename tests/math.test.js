/**
 * 
 * Tests File
 * 
 * @requires Jest
 */
const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math');

/**
 * Tasks for testing
 */
test( 'Should calculate total with tip', () => {
    const total = calculateTip( 10, 0.3 );
    expect( total).toBe(13);
    // if( total !== 13 ) throw new Error( `Total tip should be 3. Got ${ total }`);
});

test('Should calculate total with default tip', () => {
    const total = calculateTip( 10 );
    expect(total).toBe(12.5);
});

test('Should convert 32 F to 0 C', () => {
    const total = fahrenheitToCelsius( 32 );
    expect(total).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const total = celsiusToFahrenheit( 0 );
    expect(total).toBe(32);
});

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!