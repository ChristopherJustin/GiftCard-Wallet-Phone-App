import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Pressable,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { supabase } from "@/src/services/supabase";
import { useBiometricLock } from "@/src/hooks/useBiometricLock";

export default function ProfileScreen() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const {
        supported,
        enabled,
        loading,
        setBiometricEnabled,
    } = useBiometricLock();

    // Load user info
    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setEmail(user.email ?? "");
                setName((user.user_metadata as any)?.full_name ?? "");
                setPhone((user.user_metadata as any)?.phone ?? "");
            }
        })();
    }, []);

    async function handleSave() {
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: name,
                phone,
            },
        });

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Saved", "Profile updated successfully");
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
    }

    return (
        <>
            {/* Disable native header */}
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safe}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backBtn}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </Pressable>

                    <Text style={styles.title}>Profile</Text>

                    {/* Spacer for centering */}
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            editable={false}
                            style={[
                                styles.input,
                                { backgroundColor: "#f3f3f3" },
                            ]}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>

                    {/* 🔐 Biometric Lock */}
                    {supported && !loading && (
                        <View style={styles.field}>
                            <Text style={styles.label}>Biometric Lock</Text>

                            <View style={styles.row}>
                                <Text style={styles.rowText}>
                                    Require Face ID / Touch ID
                                </Text>

                                <Switch
                                    value={enabled}
                                    onValueChange={setBiometricEnabled}
                                />
                            </View>
                        </View>
                    )}

                    <Button title="Save Profile" onPress={handleSave} />
                    <View style={{ height: 12 }} />
                    <Button
                        title="Log Out"
                        color="red"
                        onPress={handleLogout}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
    },
    backBtn: {
        paddingHorizontal: 12,
    },
    backText: {
        fontSize: 24,
        color: "black",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    content: {
        padding: 24,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowText: {
        fontSize: 16,
    },
});