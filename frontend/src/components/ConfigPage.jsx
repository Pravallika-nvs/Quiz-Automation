
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ConfigPage() {
	const [category, setCategory] = useState("");
	const [topic, setTopic] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [questionsPerDay, setQuestionsPerDay] = useState("");

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let cancelled = false;
		const controller = new AbortController();

		async function fetchActive() {
			setLoading(true);
			setErrorMessage("");
			try {
				const res = await axios.get("http://localhost:8000/config/active", {
					signal: controller.signal,
				});

				if (cancelled) return;

				const data = res?.data ?? {};
				setCategory(data.category ?? "");
				setTopic(data.topic ?? "");
				setDifficulty(data.difficulty ?? "");
				// backend may return 'questions_per_day' or 'questionsPerDay'
				setQuestionsPerDay(
					(data.questions_per_day ?? data.questionsPerDay ?? "") + ""
				);
			} catch (err) {
				if (!axios.isCancel(err)) {
					setErrorMessage(
						err?.response?.data?.message || err.message || "Failed to load config"
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchActive();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, []);

	async function handleSave(e) {
		e?.preventDefault?.();
		setSaving(true);
		setSuccessMessage("");
		setErrorMessage("");

		const payload = {
			category,
			topic,
			difficulty,
			questions_per_day: Number(questionsPerDay),
			is_active: 1,
		};

		try {
			await axios.post("http://localhost:8000/config", payload, {
				headers: { "Content-Type": "application/json" },
			});
			setSuccessMessage("Configuration saved successfully.");
		} catch (err) {
			setErrorMessage(
				err?.response?.data?.message || err.message || "Failed to save configuration"
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<div className="bg-white shadow-md rounded-lg overflow-hidden">
					{/* Header */}
					<header className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
						<h1 className="text-white text-2xl font-semibold">Quiz Configuration</h1>
						<p className="text-indigo-100 mt-1 text-sm">Manage the active quiz settings</p>
					</header>

					{/* Configuration Form */}
					<main className="p-6">
						<form onSubmit={handleSave} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Category</label>
									<input
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										placeholder="Category"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Topic</label>
									<input
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										placeholder="Topic"
										value={topic}
										onChange={(e) => setTopic(e.target.value)}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Difficulty</label>
									<input
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										placeholder="Difficulty (e.g., easy, medium, hard)"
										value={difficulty}
										onChange={(e) => setDifficulty(e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Questions Per Day</label>
									<input
										type="number"
										min="0"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										placeholder="Questions Per Day"
										value={questionsPerDay}
										onChange={(e) => setQuestionsPerDay(e.target.value)}
									/>
								</div>
							</div>

							<div className="flex items-center space-x-3">
								<button
									type="submit"
									disabled={saving}
									className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 disabled:opacity-60"
								>
									{saving ? "Saving..." : "Save Configuration"}
								</button>

								{loading && (
									<span className="text-gray-500 text-sm">Loading active configuration…</span>
								)}
							</div>
						</form>
					</main>

					{/* Status Messages */}
					<footer className="p-4 border-t bg-gray-50">
						<div className="space-y-2">
							{successMessage && (
								<div className="text-sm text-green-700 bg-green-50 p-2 rounded">{successMessage}</div>
							)}

							{errorMessage && (
								<div className="text-sm text-red-700 bg-red-50 p-2 rounded">{errorMessage}</div>
							)}

							{!successMessage && !errorMessage && !loading && !saving && (
								<div className="text-sm text-gray-600">No recent activity.</div>
							)}
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
