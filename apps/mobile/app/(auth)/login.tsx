import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import { signInWithGoogle } from "@/src/services/googleOAuth";

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const { error } = await signIn(email, password);
        if (error) {
            Alert.alert("Login failed", error.message);
        } else {
            router.replace("/"); // redirect to main app
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Log In",
                    headerBackVisible: false,
                    headerLeft: () => null,
                }}
            />

            <View style={styles.container}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                <Button title="Log In" onPress={handleLogin} />
                <Button
                    title="Go to Register"
                    onPress={() => router.push("/(auth)/register")}
                />

                <Button
                    title="Continue with Google"
                    onPress={async () => {
                        try {
                            await signInWithGoogle();
                            router.replace("/")
                        } catch (error: any) {
                            Alert.alert(
                                "Google sign-in failed",
                                error?.message ?? "Unknown error"
                            );
                        }
                    }}
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