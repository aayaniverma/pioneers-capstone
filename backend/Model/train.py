# from datasets import load_dataset
# from transformers import AutoTokenizer, AutoModelForQuestionAnswering, TrainingArguments, Trainer
# from transformers import default_data_collator
# import numpy as np

# # Load dataset
# data = load_dataset("json", data_files={"train": "qa_dataset.json"}, field="data")

# # Load tokenizer and model
# model_checkpoint = "deepset/bert-base-cased-squad2"
# tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
# model = AutoModelForQuestionAnswering.from_pretrained(model_checkpoint)

# # Preprocessing function
# def preprocess(examples):
#     questions = examples["question"]
#     contexts = examples["context"]
#     answers = examples["answers"]

#     tokenized_examples = tokenizer(
#         questions,
#         contexts,
#         truncation="only_second",
#         max_length=512,
#         stride=128,
#         return_overflowing_tokens=True,
#         return_offsets_mapping=True,
#         padding="max_length",
#     )

#     sample_mapping = tokenized_examples.pop("overflow_to_sample_mapping")
#     offset_mapping = tokenized_examples.pop("offset_mapping")

#     start_positions = []
#     end_positions = []

#     for i, offsets in enumerate(offset_mapping):
#         input_ids = tokenized_examples["input_ids"][i]
#         cls_index = input_ids.index(tokenizer.cls_token_id)

#         sequence_ids = tokenized_examples.sequence_ids(i)
#         sample_index = sample_mapping[i]

#         # Fix: access nested fields correctly
#         answer = answers[sample_index]["text"]
#         answer_start = answers[sample_index]["answer_start"]

#         if answer_start is None or answer_start == -1:
#             start_positions.append(cls_index)
#             end_positions.append(cls_index)
#             continue

#         start_char = answer_start
#         end_char = start_char + len(answer)

#         token_start_index = 0
#         while sequence_ids[token_start_index] != 1:
#             token_start_index += 1

#         token_end_index = len(input_ids) - 1
#         while sequence_ids[token_end_index] != 1:
#             token_end_index -= 1

#         while token_start_index < len(offsets) and offsets[token_start_index][0] <= start_char:
#             token_start_index += 1
#         token_start_index -= 1

#         while token_end_index >= 0 and offsets[token_end_index][1] >= end_char:
#             token_end_index -= 1
#         token_end_index += 1

#         start_positions.append(token_start_index)
#         end_positions.append(token_end_index)

#     tokenized_examples["start_positions"] = start_positions
#     tokenized_examples["end_positions"] = end_positions
#     return tokenized_examples



# # Tokenize dataset
# tokenized = data.map(preprocess, batched=True, remove_columns=data["train"].column_names)

# # Training configuration
# training_args = TrainingArguments(
#     output_dir="contract_qa_model",
#     per_device_train_batch_size=8,
#     num_train_epochs=4,
#     learning_rate=3e-5,
#     save_strategy="epoch",
#     weight_decay=0.01,
#     logging_dir="./logs"
# )

# # Trainer setup
# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=tokenized["train"],
#     data_collator=default_data_collator,
#     tokenizer=tokenizer,
# )

# # Train and save
# trainer.train()
# trainer.save_model("contract_qa_model")
# tokenizer.save_pretrained("contract_qa_model")

from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForQuestionAnswering,
    TrainingArguments,
    Trainer,
    default_data_collator,
)
import torch

# Load dataset
data = load_dataset("json", data_files={"train": "qa_dataset.json"}, field="data")

# Load tokenizer and model
model_checkpoint = "deepset/bert-base-cased-squad2"
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
model = AutoModelForQuestionAnswering.from_pretrained(model_checkpoint)

def preprocess(examples):
    questions = [q.strip() for q in examples["question"]]
    contexts = examples["context"]
    answers = examples["answers"]

    tokenized_examples = tokenizer(
        questions,
        contexts,
        truncation="only_second",
        max_length=512,
        stride=128,
        return_overflowing_tokens=True,
        return_offsets_mapping=True,
        padding="max_length",
    )

    sample_mapping = tokenized_examples.pop("overflow_to_sample_mapping")
    offset_mapping = tokenized_examples.pop("offset_mapping")

    start_positions = []
    end_positions = []

    for i, offsets in enumerate(offset_mapping):
        input_ids = tokenized_examples["input_ids"][i]
        cls_index = input_ids.index(tokenizer.cls_token_id)

        sequence_ids = tokenized_examples.sequence_ids(i)
        sample_index = sample_mapping[i]
        answer = answers[sample_index]

        if len(answer["answer_start"]) == 0:
            # No answer provided
            start_positions.append(cls_index)
            end_positions.append(cls_index)
            continue

        start_char = answer["answer_start"][0]
        end_char = start_char + len(answer["text"][0])

        token_start_index = 0
        while sequence_ids[token_start_index] != 1:
            token_start_index += 1

        token_end_index = len(input_ids) - 1
        while sequence_ids[token_end_index] != 1:
            token_end_index -= 1

        if not (offsets[token_start_index][0] <= start_char and offsets[token_end_index][1] >= end_char):
            start_positions.append(cls_index)
            end_positions.append(cls_index)
        else:
            # Find exact token start
            while token_start_index < len(offsets) and offsets[token_start_index][0] <= start_char:
                token_start_index += 1
            start_positions.append(token_start_index - 1)

            # Find exact token end
            while token_end_index >= 0 and offsets[token_end_index][1] >= end_char:
                token_end_index -= 1
            end_positions.append(token_end_index + 1)

    tokenized_examples["start_positions"] = start_positions
    tokenized_examples["end_positions"] = end_positions

    return tokenized_examples

# Tokenize the dataset
tokenized = data["train"].map(preprocess, batched=True, remove_columns=data["train"].column_names)

# Define training arguments
training_args = TrainingArguments(
    output_dir="contract_qa_model",
    per_device_train_batch_size=8,
    num_train_epochs=4,
    learning_rate=3e-5,
    save_strategy="epoch",
    weight_decay=0.01,
    logging_dir="./logs"
)

# Create Trainer instance
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized,
    data_collator=default_data_collator,
    tokenizer=tokenizer,
)

# Train and save model
trainer.train()
trainer.save_model("contract_qa_model")
tokenizer.save_pretrained("contract_qa_model")