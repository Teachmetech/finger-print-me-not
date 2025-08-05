# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2024-01-XX

### Fixed
- **BREAKING FIX**: Binary responses (PDFs, images, videos, etc.) are no longer truncated at the first null byte
- Response body handling now properly supports binary content through base64 encoding
- Automatic detection of binary content types based on Content-Type headers and file extensions

### Added
- `isBinaryRequest` option in `ExecuteRequestOptions` to explicitly request binary content
- Automatic binary content detection for common file types (PDF, images, videos, etc.)
- New Response class methods:
  - `isBinaryContent()`: Check if response contains binary data
  - `getBuffer()`: Get response content as Buffer (recommended for binary data)
  - `getText()`: Get response content as text (recommended for text data)
- Comprehensive binary content example (`examples/binary_content_example.ts`)
- Warning messages when attempting to use binary content as text

### Changed
- Response class now includes `isBinary` property to indicate content type
- Improved error handling and warnings for binary content misuse
- Enhanced auto-detection logic for binary requests based on URL patterns and headers

### Technical Details
The root cause was that the native C/C++ library was serializing response bodies as NUL-terminated strings, which truncated binary data at the first null byte (common in binary files like PDFs). The fix involves:

1. Setting `isByteRequest: true` for binary content requests
2. Expecting the native library to return base64-encoded data for binary responses
3. Properly decoding binary content in the Response class
4. Maintaining backward compatibility for text content

### Migration Guide
- **No breaking changes for existing text-based requests**
- Binary content now works correctly by default (auto-detection)
- For guaranteed binary handling, use `isBinaryRequest: true` option
- Use `response.getBuffer()` instead of `response.content` for better type safety with binary data

## [0.0.4] - Previous Release
- Previous features and fixes...