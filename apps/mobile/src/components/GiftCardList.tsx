import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { GiftCard as GiftCardType } from "../types/GiftCard";

type Props = {
    cards: GiftCardType[];
    onPressCard: (card: GiftCardType) => void;
    onDeleteCard: (card: GiftCardType) => void;
};

export default function GiftCardList({
    cards,
    onPressCard,
    onDeleteCard,
}: Props) {

    return (
        <SwipeListView
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <Pressable
                    style={styles.card}
                    onPress={() => onPressCard(item)}
                >
                    <Text style={styles.title}>
                        {item.label ?? "Gift Card"}
                    </Text>

                    <Text style={styles.meta}>
                        Updated {new Date(item.updated_at).toLocaleDateString()}
                    </Text>

                    <Text style={styles.amount}>
                        Remaining: $
                        {item.remaining_amount?.toFixed(2) ?? "0.00"}
                    </Text>
                </Pressable>
            )}
            renderHiddenItem={({ item }) => (
                <Pressable
                    style={styles.deleteBtn}
                    onPress={() => onDeleteCard(item)}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            )}
            rightOpenValue={-80}
            disableRightSwipe
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No gift cards yet</Text>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    title: {
        fontSize: 16,
        letterSpacing: 1,
        fontWeight: "600",
    },
    meta: {
        marginTop: 6,
        fontSize: 12,
        color: "#6b7280",
    },
    amount: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },
    deleteBtn: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 20,
        backgroundColor: "#ef4444",
        borderRadius: 12,
        marginVertical: 6,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    emptyText: {
        color: "#6b7280",
    },
});
