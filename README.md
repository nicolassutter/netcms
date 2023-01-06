# Installation

## Notes

### Config file & editors

#### YML config file

If you are using VS Code, I highly recommend using [RedHat's extension for yaml](https://github.com/redhat-developer/vscode-yaml) and creating a `<project root>/.vscode/settings.json` file (if it does not already exist) and add this bit of config.

This will provide autocomplete when editing the `netcms.config.yml` file.

```json
// <project root>/.vscode/settings.json

{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/nicolassutter/netcms/main/public/config.schema.json": "netcms.config.yml"
  }
  // ...other settings
}
```

#### JSON config file

In most editors, placing a `"$Schema": "url to schema"` allows some autocomplete in the current json file.
I highly recommend adding this to your `netcms.config.json`.

```json
// netcms.config.json

{
  "$schema": "https://raw.githubusercontent.com/nicolassutter/netcms/main/public/config.schema.json",
  // ... the actual config
}
```
