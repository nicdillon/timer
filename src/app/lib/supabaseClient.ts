import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export async function getUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    return { user, error };
}

export const signOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
};

export const refreshSession = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.refreshSession();
    if (error) await supabase.auth.signOut()
}

export const login = async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({email, password});
    return error;
}

export const signup = async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({email, password});
    return error;
}