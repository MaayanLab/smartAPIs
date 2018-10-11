# smartAPIs
Smart API specifications for various Ma'ayan Lab Tools. Testable versions of these specifications can be found at http://smart-api.info/registry, using the "Maayanlab" tag. 

## Usage
### Python
[PySwaggerClient](https://github.com/u8sand/PySwaggerClient) makes it possible to use these APIs with python bindings.

Install with:
```bash
pip install https://github.com/u8sand/PySwaggerClient/archive/master.zip
npm install -g api-spec-converter
```

Use with:
```python
from pyswaggerclient import SwaggerClient
harmonizome = SwaggerClient('https://raw.githubusercontent.com/MaayanLab/smartAPIs/master/harmonizome_smartapi.yml')

harmonizome.actions.getEntities.call()
```

Tab-completion, documentation and more is provided through this interface.
