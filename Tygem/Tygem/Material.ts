/// <reference path="_ref.ts" />


namespace Material {

    /**
     * Adds the given material object.
     * @param name Name of the material.
     * @param object Generic object containing properties of the material.
     */
    export function addMaterial(name: string, object: any): void {
        if (materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " not added because there already exists a material with that name.");
            return;
        }
        materialDictionary[name] = object;
    }

    /**
     * Gets the material object with the given name.  Returns null (and displays an error) if the material doesn't exist.
     * @param name Name given to the material when added with addMaterial().
     */
    export function getMaterial(name: string): any {
        if (!materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " has not been added.");
            return null;
        }
        return materialDictionary[name];
    }

    /**
     * Gets property of a material.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    export function getProperty(materialName: string, propertyName: string, defaultValue: any = ""): any {
        let mat: any = getMaterial(materialName);
        if (mat === null || !mat.hasOwnProperty(propertyName)) {
            return defaultValue;
        }
        return mat[propertyName];
    }

    /**
     * Gets property of a material as a number.  Does not check if the value is a number first.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    export function getNumber(materialName: string, propertyName: string, defaultValue: number = 0): number {
        let mat: any = getMaterial(materialName);
        if (mat === null || !mat.hasOwnProperty(propertyName)) {
            return defaultValue;
        }
        return Number.parseFloat(mat[propertyName]);
    }

    let materialDictionary: { [key: string]: any; } = {};
    
}