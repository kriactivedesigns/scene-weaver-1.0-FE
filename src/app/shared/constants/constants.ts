import { HttpContextToken } from "@angular/common/http";

export const SKIP_LOADER_TOKEN = new HttpContextToken<boolean>(() => false);