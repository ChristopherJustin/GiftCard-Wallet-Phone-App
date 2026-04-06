import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Pressable,
    Text,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { createGiftCard } from "@/src/services/giftCardService";
import { getFolderById } from "@/src/services/folderService";
import { encryptGiftCardPayload } from "@/src/crypto/giftCardCrypto";

export default function CreateGiftCardScreen() {
    const { foldersId } = useLocalSearchParams<{ foldersId: string }>();
    const router = useRouter();

    const [folderName, setFolderName] = useState("Folder");

    const [label, setLabel] = useState("");
    const [number, setNumber] = useState("");
    const [pin, setPin] = useState("");

    const [initialBalance, setInitialBalance] = useState("");

    // 🔹 load folder name for back button
    useEffect(() => {
        if (!foldersId) return;
        const folder = getFolderById(foldersId);
        if (folder) setFolderName(folder.name);
    }, [foldersId]);

    async function handleSave() {
        if (!foldersId || !number || !initialBalance) return;

        const initialAmountNumber = parseFloat(initialBalance);
        if (isNaN(initialAmountNumber)) return;

        const remainingAmount = initialAmountNumber;

        const encryptedData = await encryptGiftCardPayload({
            label,
            number,
            pin,
        });

        createGiftCard(
            foldersId,
            label,
            encryptedData,
            "CODE128",
            initialAmountNumber,
            remainingAmount
        );

        router.back();
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Add Gift Card",
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backBtn}
                        >
                            <Text style={styles.backText}>
                                ‹
                            </Text>
                        </Pressable>
                    ),
                }}
            />

            <View style={styles.container}>
                <TextInput
                    placeholder="Card label (ex: Starbucks)"
                    style={styles.input}
                    value={label}
                    onChangeText={setLabel}
                />

                <TextInput
                    placeholder="Card number"
                    style={styles.input}
                    value={number}
                    onChangeText={setNumber}
                />

                <TextInput
                    placeholder="PIN (optional)"
                    style={styles.input}
                    value={pin}
                    onChangeText={setPin}
                />

                <TextInput
                    placeholder="Initial balance (ex: 50.00)"
                    style={styles.input}
                    value={initialBalance}
                    onChangeText={setInitialBalance}
                    keyboardType="numeric"
                />

                <Button title="Save Gift Card" onPress={handleSave} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    backBtn: { paddingHorizontal: 12 },
    backText: { fontSize: 24, color: "black" },

    container: {
        flex: 1,
        padding: 24,
        gap: 12,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 12,
        borderRadius: 8,
    },
});