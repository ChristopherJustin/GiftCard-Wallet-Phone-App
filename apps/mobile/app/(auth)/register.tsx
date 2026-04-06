import React, { useState } from "react";
import {
    View, TextInput, Button, StyleSheet, Text, Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { supabase } from "@/src/services/supabase";

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister() {
        if (!name.trim() || !phone.trim() || !email.trim() || !password) {
            Alert.alert("Please fill all fields");
            return;
        }

        const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({ email, password });

        if (signUpError) {
            Alert.alert("Register failed", signUpError.message);
            return;
        }

        const userId = signUpData.user?.id;
        if (!userId) {
            Alert.alert("Error", "No user ID returned");
            return;
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ id: userId, full_name: name, phone }]);

        if (profileError) {
            Alert.alert("Profile creation failed", profileError.message);
            return;
        }

        Alert.alert("Success", "Registration complete — check your email!");
        router.replace("/(auth)/login");
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Register",
                    headerBackVisible: false,
                    headerLeft: () => null,
                }}
            />

            <View style={styles.container}>
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                />

                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <Button title="Register" onPress={handleRegister} />
                <Button
                    title="Go to Log In"
                    onPress={() => router.push("/(auth)/login")}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
    },
});