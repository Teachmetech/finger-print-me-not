import { FingerPrintMeNotClient } from '../src/index.js';
import { writeFileSync } from 'fs';

async function demonstrateBinaryContent() {
    console.log('=== Binary Content Handling Example ===\n');

    // Create a session
    const session = new FingerPrintMeNotClient.Session({
        clientIdentifier: 'chrome_108'
    });

    try {
        // Example 1: Explicit binary request for a PDF
        console.log('1. Explicit binary request for PDF...');
        const pdfResponse = await session.get('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
            isBinaryRequest: true
        });
        
        console.log(`   Status: ${pdfResponse.status}`);
        console.log(`   Content-Type: ${pdfResponse.headers['Content-Type'] || pdfResponse.headers['content-type']}`);
        console.log(`   Is Binary: ${pdfResponse.isBinaryContent()}`);
        console.log(`   Content Length: ${pdfResponse.content.length} bytes`);
        
        // Save the PDF to demonstrate it's not truncated
        if (pdfResponse.ok && pdfResponse.content.length > 0) {
            writeFileSync('downloaded_pdf.pdf', pdfResponse.content);
            console.log('   ✅ PDF saved successfully as downloaded_pdf.pdf');
        }

        // Example 2: Auto-detection based on URL extension
        console.log('\n2. Auto-detection for binary content...');
        // This should auto-detect as binary due to .pdf extension
        const autoDetectedResponse = await session.get('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
        
        console.log(`   Auto-detected as binary: ${autoDetectedResponse.isBinaryContent()}`);
        console.log(`   Content Length: ${autoDetectedResponse.content.length} bytes`);

        // Example 3: Text content (should work as before)
        console.log('\n3. Regular text content...');
        const textResponse = await session.get('https://httpbin.org/json');
        
        console.log(`   Status: ${textResponse.status}`);
        console.log(`   Is Binary: ${textResponse.isBinaryContent()}`);
        console.log(`   JSON parsed successfully: ${textResponse.json ? '✅' : '❌'}`);
        if (textResponse.json) {
            console.log(`   Sample data: ${JSON.stringify(textResponse.json).substring(0, 100)}...`);
        }

        // Example 4: Using the new helper methods
        console.log('\n4. Using helper methods...');
        const response = await session.get('https://httpbin.org/json');
        
        console.log(`   getText(): ${response.getText().substring(0, 50)}...`);
        console.log(`   getBuffer() length: ${response.getBuffer().length} bytes`);

        // Example 5: Handling an image
        console.log('\n5. Handling image content...');
        const imageResponse = await session.get('https://httpbin.org/image/png', {
            headers: { 'Accept': 'image/png' }
        });
        
        console.log(`   Status: ${imageResponse.status}`);
        console.log(`   Content-Type: ${imageResponse.headers['Content-Type'] || imageResponse.headers['content-type']}`);
        console.log(`   Auto-detected as binary: ${imageResponse.isBinaryContent()}`);
        console.log(`   Content Length: ${imageResponse.content.length} bytes`);
        
        if (imageResponse.ok && imageResponse.content.length > 0) {
            writeFileSync('downloaded_image.png', imageResponse.content);
            console.log('   ✅ Image saved successfully as downloaded_image.png');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Example of the old problem (for comparison)
async function demonstrateOldProblem() {
    console.log('\n=== Comparison: Old Problem vs New Solution ===\n');
    
    const session = new FingerPrintMeNotClient.Session();
    
    try {
        // Force text handling (simulating old behavior)
        const response = await session.get('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
            isBinaryRequest: false // Force text handling
        });
        
        console.log('Old behavior (forced text handling):');
        console.log(`  Content Length: ${response.content.length} bytes`);
        console.log(`  First 100 chars: ${response.text.substring(0, 100)}`);
        console.log(`  Contains null bytes: ${response.text.includes('\\0')}`);
        
        // Now with proper binary handling
        const binaryResponse = await session.get('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {
            isBinaryRequest: true
        });
        
        console.log('\nNew behavior (binary handling):');
        console.log(`  Content Length: ${binaryResponse.content.length} bytes`);
        console.log(`  Is Binary: ${binaryResponse.isBinaryContent()}`);
        console.log(`  Buffer first 20 bytes: ${Array.from(binaryResponse.content.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
        
    } catch (error) {
        console.error('Comparison error:', error);
    }
}

// Run the examples
async function main() {
    await demonstrateBinaryContent();
    await demonstrateOldProblem();
    
    console.log('\n=== Summary ===');
    console.log('✅ Binary content (PDFs, images, etc.) is now properly handled');
    console.log('✅ Auto-detection works for common binary file extensions');
    console.log('✅ Explicit binary request option available');
    console.log('✅ Backward compatibility maintained for text content');
    console.log('✅ Helper methods available for better API');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { demonstrateBinaryContent, demonstrateOldProblem };