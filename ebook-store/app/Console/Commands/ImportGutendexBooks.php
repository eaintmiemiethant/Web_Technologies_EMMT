<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Category;
use App\Models\Ebook;

class ImportGutendexBooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * {limit-per-topic=100 : Max books to import per topic}
     * {--topics= : Comma-separated list of Gutendex topics (e.g. children,science fiction)}
     */
    protected $signature = 'import:gutenberg
                            {limit-per-topic=100 : Max books to import per topic}
                            {--topics= : Comma-separated list of Gutendex topics (e.g. children,science fiction)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import books from Project Gutenberg via Gutendex into local database, grouped by topic and filtered to English only';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit  = (int) $this->argument('limit-per-topic');
        $faker  = Faker::create();

        // Parse and clean up topics option
        $topics = collect(explode(',', $this->option('topics') ?? ''))
            ->map(fn($t) => trim($t))
            ->filter()
            ->values();

        // Default to a single "Uncategorized" bucket if no topics provided
        if ($topics->isEmpty()) {
            $topics = collect(['Uncategorized']);
        }

        foreach ($topics as $topic) {
            $this->info("Importing up to {$limit} books for topic: {$topic}");

            // Ensure the category exists
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($topic)],
                ['name' => Str::title($topic)]
            );

            $imported = 0;
            $page     = 1;

            while ($imported < $limit) {
                // Build Gutendex query parameters
                $params = [
                    'page'      => $page,
                    'languages' => 'en',        // English only
                ];

                if (strtolower($topic) !== 'uncategorized') {
                    $params['topic'] = $topic;
                }

                // Fetch the Gutendex page
                $response = Http::get('https://gutendex.com/books/', $params);

                if (! $response->successful()) {
                    $this->error("Failed to fetch page {$page} for topic '{$topic}'");
                    break;
                }

                $results = collect($response->json()['results'] ?? []);

                if ($results->isEmpty()) {
                    $this->info("No more results for '{$topic}' at page {$page}.");
                    break;
                }

                // Process each book item
                foreach ($results as $item) {
                    // Choose PDF or EPUB download link
                    $downloadUrl = data_get($item, 'formats.application/pdf')
                                 ?? data_get($item, 'formats.application/epub+zip');

                    if (! $downloadUrl) {
                        continue;
                    }

                    // Random pricing: 20% free, otherwise $1–$30
                    $isFree = $faker->boolean(20);
                    $price  = $isFree
                        ? 0.00
                        : $faker->randomFloat(2, 1, 30);

                    // Insert or update the ebook record
                    Ebook::updateOrCreate(
                        ['external_id' => $item['id']],
                        [
                            'title'       => mb_substr($item['title'], 0, 255),
                            'author'      => collect($item['authors'])
                                                ->pluck('name')
                                                ->join(', ') ?: 'Unknown',
                            'description' => $item['summaries'][0] ?? null,
                            'subjects'    => $item['subjects']   ?? [],
                            'price'       => $price,
                            'cover_image' => data_get($item, 'formats.image/jpeg'),
                            'file_path'   => $downloadUrl,
                            'category_id' => $category->id,
                        ]
                    );

                    $imported++;
                    if ($imported >= $limit) {
                        break;
                    }
                }

                $this->info(" Page {$page} imported for '{$topic}', total so far: {$imported}");
                $page++;
            }

            $this->info("Finished topic '{$topic}': imported {$imported} books.\n");
        }

        $this->info('All done!');

        return 0;
    }
}