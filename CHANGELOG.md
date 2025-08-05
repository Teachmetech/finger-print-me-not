# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2024-01-XX

### Fixed
- **BREAKING FIX**: Binary responses (PDFs, images, videos, etc.) are no longer truncated at the first null byte
- **Updated Native Binaries**: Updated `finger-print-me-not-arm64.dylib` and `finger-print-me-not-x86.dylib` to properly handle binary data with base64 encoding
- Response body handling now properly supports binary content through base64 encoding from native library
- Automatic detection of binary content types based on Content-Type headers and file extensions

### Added
- `isBinaryRequest` option in `ExecuteRequestOptions` to explicitly request binary content
- Automatic binary content detection for common file types (PDF, images, videos, etc.)
- New Response class methods:
  - `isBinaryContent()`: Check if response contains binary data
  - `getBuffer()`: Get response content as Buffer (recommended for binary data)
  - `getText()`: Get response content as text (recommended for text data)
- Comprehensive binary content example (`examples/binary_content_example.ts`)
- Base64 corruption detection and recovery for binary responses
- UTF-8 corruption protection when transferring base64 data from native library

### Changed
- Response class now includes `isBinary` property to indicate content type
- Enhanced binary content handling with proper base64 decoding from native library
- Improved error handling and warnings for binary content misuse
- Enhanced auto-detection logic for binary requests based on URL patterns and headers
- Native library now returns `body_len` field for binary responses to enable proper validation

### Technical Details
The issue was resolved through a two-part fix:

1. **Native Library Update**: Updated macOS binaries (`finger-print-me-not-arm64.dylib`, `finger-print-me-not-x86.dylib`) to:
   - Detect binary requests using the `isByteRequest` flag
   - Base64-encode binary response bodies to prevent null-byte truncation
   - Include `body_len` field with original data length for validation
   - Properly handle binary data without string termination issues

2. **JavaScript Enhancement**: Enhanced Response class to:
   - Detect `body_len` field indicating base64-encoded binary data
   - Automatically decode base64 responses back to original binary format
   - Validate data integrity by comparing decoded length with `body_len`
   - Clean corrupted base64 data caused by UTF-8 processing
   - Provide fallback handling for legacy string-based responses

**Result**: Complete binary data preservation with zero truncation for all file types.

### Migration Guide
- **No breaking changes for existing text-based requests**
- **Binary content now works perfectly** - complete data preservation with zero truncation
- Auto-detection handles most binary content automatically
- For explicit control, use `isBinaryRequest: true` option
- Use `response.getBuffer()` for binary content and `response.getText()` for text content
- **Recommended**: Test existing binary file downloads to verify complete data recovery

## [0.0.4] - Previous Release
- Previous features and fixes...