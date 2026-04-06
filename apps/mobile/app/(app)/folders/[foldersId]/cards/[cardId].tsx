import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    Pressable,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Barcode } from "react-native-barcode-rnsvg";
import {
    getGiftCardById,
    spendOnGiftCard,
    getSpendHistory,
} from "@/src/services/giftCardService";
import { getFolderById } from "@/src/services/folderService";
import { decryptGiftCardPayload } from "@/src/crypto/giftCardCrypto";
import { useBiometricLock } from "@/src/hooks/useBiometricLock";
import { unlockEncryptionKey } from "@/src/crypto/keyManager";

export default function GiftCardDetailScreen() {
    const { foldersId, cardId } = useLocalSearchParams<{
        foldersId: string;
        cardId: string;
    }>();
    const router = useRouter();

    const [card, setCard] = useState<any>(null);
    const [spendAmount, setSpendAmount] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [folderName, setFolderName] = useState("Folders");
    const [data, setData] = useState<{ label?: string; number?: string; pin?: string }>({});
    const { requireBiometricAuth } = useBiometricLock();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        (async () => {
            const ok = await requireBiometricAuth();

            if (!ok) {
                router.back(); // 🚫 deny access
                return;
            }

            // 🔑 Unlock encryption key ONLY after biometric success
            unlockEncryptionKey(`user-${cardId}-key`);

            setAuthorized(true);
        })();
    }, []);

    useEffect(() => {
        if (!authorized) return;
        if (!cardId || !foldersId) return;

        const foundCard = getGiftCardById(cardId);
        if (!foundCard) return;

        setCard(foundCard);

        (async () => {
            const parsed = await decryptGiftCardPayload(foundCard.encrypted_data);
            setData(parsed);
        })();

        const folder = getFolderById(foldersId);
        if (folder) setFolderName(folder.name);

        setHistory(getSpendHistory(cardId));
    }, [authorized, cardId, foldersId]);

    function handleSpend() {
        if (!cardId || !spendAmount) return;

        const amount = parseFloat(spendAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert("Invalid amount", "Enter a valid number");
            return;
        }

        const updated = spendOnGiftCard(cardId, amount);
        setCard({ ...card, remaining_amount: updated });
        setHistory(getSpendHistory(cardId));
        setSpendAmount("");
    }

    

    if (!authorized) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text>Unlocking…</Text>
            </SafeAreaView>
        );
    }

    if (!card) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: data.label,
                    headerBackTitle: folderName,
                    headerRight: () => (
                        <Pressable
                            onPress={() => router.push("/profile")}
                            style={{ paddingRight: 12 }}
                        >
                            <Text style={{ fontSize: 22 }}>👤</Text>
                        </Pressable>
                    ),
                }}
            />

            <SafeAreaView
                style={styles.safe}
                edges={["bottom", "left", "right"]}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.barcodeContainer}>
                        <Barcode
                            value={data.number ?? ""}
                            format={card.barcode_format}
                            width={2}
                            height={100}
                            lineColor="#000"
                            background="#fff"
                            displayValue={false}
                        />
                    </View>

                    <Text style={styles.code}>{data.number}</Text>

                    {data.pin ? <Text style={styles.pin}>PIN: {data.pin}</Text> : null}

                    <Text style={styles.balance}>
                        Remaining: $
                        {card.remaining_amount?.toFixed(2) ?? "0.00"}
                    </Text>

                    <TextInput
                        placeholder="Amount spent"
                        keyboardType="numeric"
                        style={styles.input}
                        value={spendAmount}
                        onChangeText={setSpendAmount}
                    />

                    <Button title="Apply Spend" onPress={handleSpend} />

                    <Text style={styles.historyTitle}>Spend History</Text>

                    {history.length === 0 ? (
                        <Text style={styles.emptyHistory}>
                            No spend history yet
                        </Text>
                    ) : (
                        history.map((item) => (
                            <View key={item.id} style={styles.historyItem}>
                                <Text style={styles.historyAmount}>
                                    -${item.amount_spent.toFixed(2)}
                                </Text>
                                <Text style={styles.historyDate}>
                                    {new Date(
                                        item.created_at
                                    ).toLocaleString()}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    container: {
        padding: 24,
        backgroundColor: "#fff",
        gap: 16,
    },
    barcodeContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    pin: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 8,
        color: "#3b3b3b",
    },
    code: {
        textAlign: "center",
        fontSize: 18,
        letterSpacing: 1,
        marginBottom: 12,
    },
    balance: {
        fontSize: 18,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 12,
        borderRadius: 8,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 24,
    },
    emptyHistory: {
        fontSize: 14,
        color: "#6b7280",
    },
    historyItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    historyAmount: {
        fontSize: 16,
        fontWeight: "500",
    },
    historyDate: {
        fontSize: 12,
        color: "#6b7280",
    },
});