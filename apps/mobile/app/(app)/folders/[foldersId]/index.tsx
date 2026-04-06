import React, { useEffect, useState, useCallback } from "react";
import { View, Button, StyleSheet, Text, Pressable } from "react-native";
import {
    Stack,
    useLocalSearchParams,
    useRouter,
    useFocusEffect,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import GiftCardList from "@/src/components/GiftCardList";
import {
    getGiftCardsByFolder,
    deleteGiftCard,
} from "@/src/services/giftCardService";
import { getFolderById } from "@/src/services/folderService";
import { GiftCard } from "@/src/types/GiftCard";
import { decryptGiftCardPayload } from "@/src/crypto/giftCardCrypto";

export default function FolderDetailScreen() {
    const { foldersId } = useLocalSearchParams<{ foldersId: string }>();
    const router = useRouter();

    const [cards, setCards] = useState<GiftCard[]>([]);
    const [folderName, setFolderName] = useState("Folder");

    // Load folder name for header
    useEffect(() => {
        if (!foldersId) return;
        const folder = getFolderById(foldersId);
        if (folder) setFolderName(folder.name);
    }, [foldersId]);

    // Refresh cards on focus
    useFocusEffect(
        useCallback(() => {
            let active = true;

            (async () => {
                if (!foldersId) return;

                const rawCards = getGiftCardsByFolder(foldersId);

                const enriched = await Promise.all(
                    rawCards.map(async (card) => {
                        const parsed = await decryptGiftCardPayload(
                            card.encrypted_data
                        );

                        return {
                            ...card,
                            display_label:
                                parsed.label || "Gift Card",
                        };
                    })
                );

                if (active) {
                    setCards(enriched);
                }
            })();

            return () => {
                active = false;
            };
        }, [foldersId])
    );

    function handleDeleteCard(card: GiftCard) {
        deleteGiftCard(card.id);
        if (foldersId) setCards(getGiftCardsByFolder(foldersId));
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: folderName,
                    headerBackTitle: "Folders",
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
                <View style={styles.content}>
                    <Button
                        title="Add Gift Card"
                        onPress={() =>
                            router.push(
                                `/folders/${foldersId}/create-card`
                            )
                        }
                    />

                    <GiftCardList
                        cards={cards}
                        onPressCard={(card) =>
                            router.push(
                                `/folders/${foldersId}/cards/${card.id}`
                            )
                        }
                        onDeleteCard={handleDeleteCard}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    content: { flex: 1, padding: 12 },
});