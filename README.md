# Installation

## Notes

### VS Code

If you are using VS Code, I highly recommend using [RedHat's extension for yaml](https://github.com/redhat-developer/vscode-yaml) and creating a `<project root>/.vscode/settings.json` file (if it does not already exist) and add this bit of config.

This will provide autocomplete when editing the `netcms.config.yml` file.

```json
{
  // ...other settings
  "yaml.schemas": {
    "https://raw.githubusercontent.com/nicolassutter/netcms/main/public/config.schema.json": "netcms.config.yml"
  }
}
```
