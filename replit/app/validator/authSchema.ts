import vine from "@vinejs/vine"

export const authSchema = vine.object({
    email : vine.string().email(), 
    password : vine.string().minLength(6)
})