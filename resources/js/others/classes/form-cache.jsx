import { base64ToFile } from "@/others/function";

const PREFIX = "draft-cache:";

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

/**
 * Reusable localStorage draft cache for forms — keeps in-progress field
 * values (including File inputs) so an accidentally closed tab doesn't lose
 * unsaved input. File values are transparently round-tripped through
 * base64 so they survive JSON serialization.
 */
export class FormCache {
    static async save(key, data) {
        try {
            const entries = await Promise.all(
                Object.entries(data).map(async ([k, v]) => {
                    if (v instanceof File) {
                        return [k, { __file: true, name: v.name, base64: await fileToBase64(v) }];
                    }
                    return [k, v];
                })
            );
            localStorage.setItem(PREFIX + key, JSON.stringify(Object.fromEntries(entries)));
        } catch (e) {
            console.log(e);
        }
    }

    static load(key) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            if (!raw) return null;

            const data = JSON.parse(raw);
            Object.entries(data).forEach(([k, v]) => {
                if (v && typeof v === "object" && v.__file) {
                    data[k] = base64ToFile(v.base64, v.name);
                }
            });
            return data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static clear(key) {
        try {
            localStorage.removeItem(PREFIX + key);
        } catch (e) {}
    }
}
